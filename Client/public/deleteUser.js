document.getElementById('deleteAccountBtn').addEventListener('click', async () => {
    const email = localStorage.getItem('email');

    if (!email) {
        alert('No user is logged in.');
        return;
    }

    try {
        // Fetch the user_id using the email
        const userIdResponse = await fetch(`http://localhost:3000/getUserId/${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const userIdResult = await userIdResponse.json();

        if (!userIdResponse.ok || !userIdResult.id_user) {
            alert('Failed to fetch user ID.');
            return;
        }

        console.log(userIdResult.id_user)

        const userId = userIdResult.id_user;

        // Delete the user using the user_id
        const deleteResponse = await fetch(`http://localhost:3000/deleteUser/${userId}`, {
            method: 'DELETE'
        });

        if (deleteResponse.ok) {
            // Clear local storage and redirect
            localStorage.clear();
            window.location.href = 'http://127.0.0.1:5500/Client/public/';
        } else {
            alert('Failed to delete account.');
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        alert('An error occurred while deleting the account.');
    }
});