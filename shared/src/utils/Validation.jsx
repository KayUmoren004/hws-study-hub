import * as Yup from "yup";

// Login
export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Required")
    .matches(/[\w0-9\.-]*@hws\.edu/, "HWS email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
});

// Forgot Password
export const ForgotSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Required")
    .matches(/[\w0-9\.-]*@hws\.edu/, "HWS email is required"),
});

// S1
export const S1Schema = Yup.object().shape({
  name: Yup.string()
    .required("Full Name is required")
    .min(6, "Full Name must be at least 6 characters long")
    .max(30, "Full Name must be less than 30 characters long"),
  email: Yup.string()
    .email("Invalid email")
    .required("Required")
    .matches(/[\w0-9\.-]*@hws\.edu/, "HWS email is required"),
});

// Sign Up
export const SignUpSchema = Yup.object().shape({
  password: Yup.string()
    .required("Please Enter your password")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
  confirmPassword: Yup.string()
    .required("Please Confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

// Add Course
export const CourseSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(2, "Title must be at least 2 characters"),
  code: Yup.string()
    .required("Code is required")
    .min(2, "Code must be at least 2 characters"),
  // credits: Yup.number().required("Credits is required"),
  instructor: Yup.string()
    .required("Instructor is required")
    .min(2, "Instructor must be at least 2 characters"),
});

// Request Help
export const RequestHelp = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(2, "Title must be at least 2 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(20, "Description must be at least 20 characters"),
  // tag: Yup.string().required("Tag is required"),
});

// Edit Profile

// Name
export const NameSchema = Yup.object().shape({
  name: Yup.string()
    .required("Full Name is required")
    .min(6, "Full Name must be at least 6 characters long")
    .max(30, "Full Name must be less than 30 characters long"),
});

// Email
export const EmailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Required")
    .matches(/[\w0-9\.-]*@hws\.edu/, "HWS email is required"),
});

// Password
export const PasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Please Enter your password")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
  confirmPassword: Yup.string()
    .required("Please Confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

// Phone Number
export const PhoneNumberSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(
      /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/,
      "Phone Number must be valid"
    ),
});
