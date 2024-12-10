import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  InputAdornment,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import http from './axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await http.get('/doctor/getAllDoctors');
      if (response !== 0) setDoctors(response);
      else {
        <h1> No Doctors Available..</h1>
      }
    } catch (err) {
      setError('Failed to fetch doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [navigate]);

  const handleConsultButtonClick = (doctor) => {
    if (isLoggedIn && userRole === 'patient') {
      setSelectedDoctor(doctor);
      setOpenDialog(true);
    } else {
      toast.error('Please Login first..');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDoctor(null);
  };

  const formik = useFormik({
    initialValues: {
      requestedTime: '',
      description: '',
      images: [],
    },
    validationSchema: Yup.object({
      requestedTime: Yup.date().required('Date and Time are required').min(new Date(), 'Date and time must be in the future'),
      description: Yup.string().required('Description is required').min(5, 'Description must be at least 5 characters'),
    }),
    onSubmit: (values) => {
      handleRequestConsultation(values);
    },
  });

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    formik.setFieldValue('images', [...formik.values.images, ...files]);
  };

  const handleRequestConsultation = (values) => {
    const formData = new FormData();
    formData.append('patientId', localStorage.getItem('id'));
    formData.append('doctorId', selectedDoctor.id);
    formData.append('dateTime', values.requestedTime);
    formData.append('description', values.description);
    formData.append('status', 'Pending');
  
    if (values.images.length > 0) {
      const file = values.images[0]; 
      formData.append('images', file); 
    }
  
    http.post('/consultations/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        toast.success('Consultation Request Scheduled');
        setTimeout(() => {
          navigate('/consultation-status');
        }, 1500);
      })
      .catch((error) => {
        toast.error('Error scheduling consultation');
        console.error(error);
      });
  };
  
  return (
    <div>
      {/* Loading Spinner */}
      {loading && <CircularProgress sx={styles.loading} />}

      {/* Error Message */}
      {error && <Typography sx={styles.error}>{error}</Typography>}

      {/* Table to display doctor data */}
      {doctors.length > 0 && (
        <TableContainer component={Paper} sx={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={styles.tableHeaderCell}>S No.</TableCell>
                <TableCell sx={styles.tableHeaderCell}>Name</TableCell>
                <TableCell sx={styles.tableHeaderCell}>Email</TableCell>
                <TableCell sx={styles.tableHeaderCell}>Specialization</TableCell>
                <TableCell sx={styles.tableHeaderCell}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.map((doctor, index) => (
                <TableRow key={doctor.id} sx={styles.tableRow}>
                  <TableCell sx={styles.tableCell}>{index + 1}</TableCell>
                  <TableCell sx={styles.tableCell}>{doctor.name}</TableCell>
                  <TableCell sx={styles.tableCell}>{doctor.email}</TableCell>
                  <TableCell sx={styles.tableCell}>{doctor.specialization}</TableCell>
                  <TableCell sx={styles.tableCell}>
                    <Button
                      variant="contained"
                      color="success"
                      sx={styles.consultButton}
                      onClick={() => handleConsultButtonClick(doctor)}
                      disabled={!(isLoggedIn && userRole === 'patient')}
                    >
                      Consult
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Consultation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth={true}
        sx={styles.dialog}
      >
        <DialogTitle>Request Consultation</DialogTitle>
        <DialogContent sx={styles.dialogContent}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              label="Requested Time"
              name="requestedTime"
              type="datetime-local"
              value={formik.values.requestedTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              sx={styles.textField}
              error={formik.touched.requestedTime && Boolean(formik.errors.requestedTime)}
              helperText={formik.touched.requestedTime && formik.errors.requestedTime}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              sx={styles.textField}
              multiline
              rows={4}
              placeholder="Describe your disease or symptoms.."
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
            <Button
              variant="contained"
              component="label"
              color="primary"
              sx={styles.uploadButton}
            >
              Upload Images
              <input
                type="file"
                hidden
                multiple
                onChange={handleFileChange}
              />
            </Button>
            {formik.values.images.length > 0 && (
              <Typography sx={styles.fileName}>
                {formik.values.images.map((file, index) => (
                  <span key={index}>{file.name}</span>
                ))}
              </Typography>
            )}
            <DialogActions sx={styles.dialogActions}>
              <Button
                variant="contained"
                color="success"
                type="submit"
                sx={styles.requestButton}
              >
                Request Consultation
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleCloseDialog}
                sx={styles.cancelButton}
              >
                Cancel
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <ToastContainer />
    </div>
  );
};

const styles = {
  loading: { marginTop: '20px' },

  error: { color: 'red', marginTop: '20px' },

  tableContainer: { marginTop: '10px', marginBottom: '10px', marginLeft: '15px', marginRight: '15px', width: '98%', boxShadow: '0px 4px 8px rgba(0,0,0,0.3)' },

  tableHeaderCell: { backgroundColor: '#4caf50', fontWeight: 'bold', color: '#fff', textAlign: 'center', padding: '12px', fontSize: '18px' },

  tableRow: { '&:hover': { backgroundColor: '#ddd' } },

  tableCell: { padding: '16px', textAlign: 'center', border: '2px solid #ddd', fontSize: '16px' },

  consultButton: { fontSize: '16px', padding: '6px 20px', textTransform: 'none' },

  dialog: { maxWidth: '500px', margin: 'auto' },

  dialogContent: { padding: '18px' },

  textField: { marginBottom: '10px', marginTop: '10px' },

  uploadButton: { marginTop: '10px' },

  fileName: { marginTop: '10px', fontSize: '14px' },

  dialogActions: {
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },

  requestButton: {
    width: '100%',
    backgroundColor: '#4caf50',
  },

  cancelButton: {
    width: '100%',
    backgroundColor: '#f44336',
  },
};

export default DoctorsList;

