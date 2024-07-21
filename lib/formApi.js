const apiPrefix = process.env.NEXT_PUBLIC_FORM_API_URL;

export async function getAllForm() {
    try {
        const res = await fetch(`${apiPrefix}/form`);
        return await res.json();
    } catch(err) {
        return [];
    }
}

export async function getFormById(id) {
    try {
        const res = await fetch(`${apiPrefix}/form/${id}`);
        return await res.json();
    } catch(err) {
        return null;
    }
}

export async function createForm(body) {
    try {
        const res = await fetch(`${apiPrefix}/form`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        return await res.json();
    } catch(err) {
        return err;
    }
}

export async function editFormById(id, body) {
    try {
        const res = await fetch(`${apiPrefix}/form/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        return await res.json();
    } catch(err) {
        return err;
    }
}