// declare hierarchy
// super-admin : all-access
// viewer-admin : only view access
// moderator : only scan (no admin) 

const hierarchy: Record<string, string[]> = {
    "super-admin": ['view','create','edit','delete','qr','offline_reg','resend_mail'],
    "viewer-admin": ['view','qr'],
    "moderator": ['qr','offline_reg'],
    "none": []
}

type Role = keyof typeof hierarchy;

export function checkIfAllowed(operation: string, role: Role) {
    if (hierarchy[role].includes(operation)) {
        return true;
    }

    return false;
}