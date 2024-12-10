// import crypto from 'crypto';

function generateRandomMeetingID() {
    return Math.floor(10000000000 + Math.random() * 90000000000); // 10-digit number
}

function generateRandomPassword() {
    return Math.floor(100000 + Math.random()* 900000) 
}

export default function generateMeetingLink() {
    const meetingID = generateRandomMeetingID();
    const password = generateRandomPassword();
    const baseUrl = "https://skype.com/";

    const meetingLink = `${baseUrl}/${meetingID}?pwd=${password}`;
    return meetingLink;
}

// Generate the link
// const meetingLink = generateMeetingLink();
// console.log("Generated Meeting Link:", meetingLink);
