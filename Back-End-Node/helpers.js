///////////helpers///////


const getSignUpDetailsFromDatabase = async (userId) => {
  try {
   

    // Query to select all sign-up details from the table
    const query =  "SELECT * FROM public.attandence WHERE id = $1";

    // Execute the query
    const result = await pool.query(query,[userId]);

    // Return the rows from the result
    return result.rows;
  } catch (error) {
    console.error("Error fetching sign-up details from the database:", error);
    throw error;
  }
};


const cancelSignUp = async (classId, userId) => {
  try {

    await pool.query(
      "DELETE FROM public.attendance WHERE user_id = $1 AND session_id = $2",
      [userId, classId]
    );


  } catch (error) {
    console.error("Error canceling sign-up:", error);
    throw error;
  }
};

const insertSignUp = async (sessionId,role,userId,period) => {
  try {
    await pool.query(
      "INSERT INTO public.attendance(created_at, user_id, session_id, role, period) VALUES ( $1, $2, $3, $4, $5)"
    ,[new Date(), userId, sessionId, role, period  ]);
  } catch (error) {
    console.error("Error insetr  sign-up:", error);
    throw error;
  }
};



module.exports = {
  cancelSignUp,
  getSignUpDetailsFromDatabase,
  insertSignUp,
};