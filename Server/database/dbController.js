const poolPromise = require('./dbConfig');

const getAllUsers = async () => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM users');
    return result.recordset;
  } catch (err) {
    throw new Error(err.message);
  }
};

const addUser = async (user) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('family_name', user.family_name)
      .input('given_name', user.given_name)
      .input('email', user.email)
      .input('password', user.password)
      .input('role', user.role)
      .query('INSERT INTO users (family_name, given_name, email, password, role) VALUES (@family_name, @given_name, @email, @password, @role)');
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

const loginUser = async (email, password) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', email)
      .input('password', password)
      .query('SELECT * FROM users WHERE email = @email AND password = @password');
    return result.recordset[0];
  } catch (err) {
    throw new Error(err.message);
  }
};

const getImageById = async (id) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', id)
      .query('SELECT image FROM Movies WHERE id_movie = @id'); // Adjust table name and column as needed
    return result.recordset[0] ? result.recordset[0].image : null;
  } catch (err) {
    throw new Error(err.message);
  }
}

const getMoviesByDate = async (date) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('date', date)
      .query('SELECT * FROM Movies INNER JOIN MovieXrefTheatre ON Movies.id_movie = MovieXrefTheatre.id_movie WHERE CONVERT(DATE, MovieXrefTheatre.running_datetime) = @date'); // Adjust table names and query as needed
    return result.recordset;
  } catch (err) {
    throw new Error(err.message);
  }
}

const getSeatAvailability = async (id_movie, id_theatre, running_datetime) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_movie', id_movie)
      .input('id_theatre', id_theatre)
      .input('running_datetime', running_datetime)
      .query(`SELECT availability FROM MovieXrefTheatre 
                  WHERE id_movie = @id_movie 
                    AND id_theatre = @id_theatre 
                    AND running_datetime = @running_datetime`);
    return result.recordset[0] ? result.recordset[0].availability : null;
  } catch (err) {
    throw new Error(err.message);
  }
}

const updateSeatAvailability = async (id_movie, id_theatre, date, availabilityData) => {
  try {
    const pool = await poolPromise;
    const availabilityJSON = JSON.stringify(availabilityData);
    await pool.request()
      .input('id_movie', id_movie)
      .input('id_theatre', id_theatre)
      .input('date', date)
      .input('availability', availabilityJSON)
      .query(`
        UPDATE MovieXrefTheatre
        SET availability = @availability
        WHERE id_movie = @id_movie 
          AND id_theatre = @id_theatre 
          AND running_datetime = @date
      `);

    return { success: true, message: 'Availability updated successfully' };
  } catch (err) {
    console.error('Error updating availability:', err);
    return { success: false, error: 'Internal server error' };
  }
}

const createBooking = async (id_user, id_movie_xref_theatre, seats_booked, booking_time) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id_user', id_user)
      .input('id_movie_xref_theatre', id_movie_xref_theatre)
      .input('seats_booked', JSON.stringify(seats_booked)) // Store seats as a JSON string
      .input('booking_time', booking_time)
      .query(`
        INSERT INTO Bookings (id_user, id_movie_xref_theatre, seats_booked, booking_time)
        VALUES (@id_user, @id_movie_xref_theatre, @seats_booked, @booking_time)
      `);

    return { success: true, message: 'Booking created successfully' };
  } catch (err) {
    console.error('Error creating booking:', err);
    return { success: false, error: 'Internal server error' };
  }
}

const getUserIdByEmail = async (email) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', email)
      .query(`
        SELECT id_user
        FROM Users
        WHERE email = @email
      `);

    if (result.recordset.length > 0) {
      return { success: true, id_user: result.recordset[0].id_user };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (err) {
    console.error('Error fetching user ID:', err);
    return { success: false, error: 'Internal server error' };
  }
}

const getMovieXrefTheatreId = async (id_movie, id_theatre, running_datetime) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_movie', id_movie)
      .input('id_theatre', id_theatre)
      .input('running_datetime', running_datetime)
      .query(`
        SELECT id_screen_xref_movie
        FROM MovieXrefTheatre
        WHERE id_movie = @id_movie
          AND id_theatre = @id_theatre
          AND running_datetime = @running_datetime
      `);

    if (result.recordset.length > 0) {
      return { success: true, id_movie_xref_theatre: result.recordset[0].id_screen_xref_movie };
    } else {
      return { success: false, error: 'Movie x Theatre not found' };
    }
  } catch (err) {
    console.error('Error fetching movie x theatre ID:', err);
    return { success: false, error: 'Internal server error' };
  }
}

const getReservationDetails = async (id_user) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_user', id_user)
      .query(`
        SELECT m.title, mxr.running_datetime, b.seats_booked, mxr.id_theatre
        FROM Bookings b
        JOIN MovieXrefTheatre mxr ON b.id_movie_xref_theatre = mxr.id_screen_xref_movie
        JOIN Movies m ON mxr.id_movie = m.id_movie
        WHERE b.id_user = @id_user
          AND mxr.running_datetime >= GETDATE()
      `);

    if (result.recordset.length > 0) {
      return { success: true, reservation_details: result.recordset };
    } else {
      return { success: true, reservation_details: null };
    }
  } catch (err) {
    console.error('Error fetching reservation details:', err);
    return { success: false, error: 'Internal server error' };
  }
};

const deleteUser = async (id_user) => {
  try {
    const pool = await poolPromise;
    const transaction = pool.transaction();

    await transaction.begin();

    try {
      await transaction.request()
        .input('id_user', id_user)
        .query(`
          DELETE FROM Bookings WHERE id_user = @id_user;
          DELETE FROM Reviews WHERE id_user = @id_user;
          DELETE FROM Users WHERE id_user = @id_user;
        `);

      await transaction.commit();
      return { success: true };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    console.error('Error deleting user:', err);
    return { success: false, error: 'Internal server error' };
  }
};


module.exports = {
  getAllUsers,
  addUser,
  loginUser,
  getImageById,
  getMoviesByDate,
  getSeatAvailability,
  updateSeatAvailability,
  createBooking,
  getUserIdByEmail,
  getMovieXrefTheatreId,
  getReservationDetails,
  deleteUser
};
