function isMissing(value) {
    return value === undefined || value === null || String(value).trim() === "";
}

function trimText(value) {
    if (typeof value === "string") {
        return value.trim();
    }
    return value;
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === "string" && emailPattern.test(email);
}

function isStrongPassword(password) {
    if (typeof password !== "string" || password.length < 8) {
        return false;
    }
    return /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password);
}

function isValidId(id) {
    const number = Number(id);
    return Number.isInteger(number) && number > 0;
}

function isPositiveNumber(value) {
    if (isMissing(value)) {
        return false;
    }
    const number = Number(value);
    return !isNaN(number) && number > 0;
}

function isValidRating(value) {
    if (isMissing(value)) {
        return false;
    }
    const number = Number(value);
    return Number.isInteger(number) && number >= 1 && number <= 5;
}

module.exports = {
    isMissing,
    trimText,
    isValidEmail,
    isStrongPassword,
    isValidId,
    isPositiveNumber,
    isValidRating
};