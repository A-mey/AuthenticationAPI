type gender = "M"|"F";
type title = "Mr"|"Ms"|"Mrs";

export type User = {
    EMAILID: string;
    FIRSTNAME: string;
    LASTNAME?: string;
    GENDER: gender;
    TITLE: title;
    DOB: string;
}