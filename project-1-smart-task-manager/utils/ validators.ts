export function validateRegisterInput(
  name: string,
  email: string,
  password: string,
) {
  if (!name || !email || !password) {
    return "All fields are required";
  }

  if (name.length < 3) {
    return "Name too short";
  }

  if (!email.includes("@")) {
    return "Invalid email";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
}

export function validateLoginInput(email: string, password: string) {
  if (!email || !password) {
    return "Email and password required";
  }

  return null;
}

export function validateTaskInput(title: string) {
  if (!title || title.trim() === "") {
    return "Task title required";
  }

  return null;
}
