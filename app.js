/*!-- Largedly adopted from CS340 starter_code --*/
/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))

PORT = 9322;

// Database
var db = require('./database/db-connector');

// Handlebars
var exphbs = require('express-handlebars');
const { query } = require('express');
app.engine('.hbs', exphbs.engine({
    extname: ".hbs"
}));
app.set('view engine', '.hbs');

// Static Files
app.use(express.static('public'));

/*
    ROUTES
*/

// GET ROUTES for Index page
app.get('/', (req, res) => {
    res.render('index');
});

// GET ROUTES for Classes page
app.get('/classes', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.class_name === undefined)
    {
        query1 = "SELECT * FROM classes;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM classes WHERE class_name LIKE "${req.query.class_name}%"`
    }

    // Query 2 & 3 is the same in both cases
    let query2 = "SELECT * FROM instructors;";
    let query3 = "SELECT * FROM departments;";
    let query4 = "SELECT * FROM sections"
    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields) {
        
        // Save the people
        let classes = rows;

        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            let instructors = rows;
            let instructormap = {}
            instructors.map(instructor => {
                let id = parseInt(instructor.instructor_id, 10);

                instructormap[id] = instructor["first_name"] + " " + instructor["last_name"];
            })

        classes = classes.map(aclass => {
            return Object.assign(aclass, {instructor_id: instructormap[aclass.instructor_id]})
        })
        
        db.pool.query(query3, function(error, rows, fields) {
            let departments = rows;
            db.pool.query(query4, function(error, rows, fields) {
                let sections = rows;
                return res.render('classes', {data: classes, instructors: instructors, departments: departments, sections: sections});
            })
            
        })
    })
    })
});
// POST ROUTES for Classes page
app.post('/add-class-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO classes (class_id, class_code, class_name, department_id, capacity, instructor_id, section, year, quarter) 
    VALUES ('${data.class_id}', '${data.class_code}', '${data.class_name}', '${data.department_id}', '${data.capacity}', 
    '${data.instructor_id}', '${data.section}', '${data.year}', '${data.quarter}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        
        else
        {
            // If there was no error, perform a SELECT * on classes
            query2 = `SELECT * FROM classes;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});
// DELETE ROUTES for Classes page
app.delete('/delete-class-ajax/', function(req,res,next){
    let data = req.body;
    let classID = parseInt(data.class_id);
    let deleteClasses= `DELETE FROM classes WHERE class_id = ?`;
    // code for M:M table
    let deleteRegistrationDetails = `DELETE FROM registration_details WHERE registration_details.class_id = ?`;
  
          // Run the 1st query
          db.pool.query(deleteRegistrationDetails, [classID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteClasses, [classID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});
// PUT ROUTES for Classes page
app.put('/put-class-ajax', function(req,res,next){
let data = req.body;

let class_code = data.class_code;
let class_name = data.class_name;
let instructor_id = data.instructor_id;
let capacity = data.capacity;
let department_id = data.department_id;
let section = data.section;
let year = data.year;
let quarter = data.quarter;
let aclass = parseInt(data.class_details);

// This update part is wholly my own work
let queryUpdateClass = `UPDATE classes 
SET class_code = CASE WHEN ? <> '' THEN ? ELSE class_code END, 
class_name = CASE WHEN ? <> '' THEN ? ELSE class_name END, 
department_id = CASE WHEN ? <> '' THEN ? ELSE department_id END, 
capacity = CASE WHEN ? <> '' THEN ? ELSE capacity END, 
instructor_id = CASE WHEN ? <> '' THEN ? ELSE instructor_id END, 
section = CASE WHEN ? <> '' THEN ? ELSE section END, 
year = CASE WHEN ? <> '' THEN ? ELSE year END, 
quarter = CASE WHEN ? <> '' THEN ? ELSE quarter END 
WHERE classes.class_id = ?`;
let selectClassName = `SELECT * FROM classes WHERE (class_code = ? OR class_name = ? OR department_id = ? OR capacity = ? OR instructor_id = ? OR section = ? OR year = ? OR quarter = ?) AND class_id = ?`

// Run the 1st query
db.pool.query(queryUpdateClass, [class_code, class_code, class_name, class_name, department_id, department_id, capacity, capacity, instructor_id, instructor_id, section, section, year, year, quarter, quarter, aclass], function(error, rows, fields){
    if (error) {

    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
    console.log(error);
    res.sendStatus(400);
    }

    // If there was no error, we run our second query and return that data so we can use it to update the classes
    // table on the front-end
    else {
        // Run the second query
        db.pool.query(selectClassName, [class_code, class_name, department_id, capacity, instructor_id, section, year, quarter, aclass], function(error, rows, fields) {

            if (error) {
                console.log(error);
                res.sendStatus(400);
            } 
            else {
                res.send(rows);
            }
        })
            
    }
})
});

// GET ROUTES for Instructors page
app.get('/instructors', function(req, res)
    {  
        let query1;               // Define our query

        // If there is no query string, we just perform a basic SELECT
        if (req.query.last_name === undefined)
        {
            query1 = "SELECT * FROM instructors;";
        }

        // If there is a query string, we assume this is a search, and return desired results
        else
        {
            query1 = `SELECT * FROM instructors WHERE last_name LIKE "${req.query.last_name}%"`
        }

        db.pool.query(query1, function(error, rows, fields){
        
            // Save the people
            let instructors = rows;
            
            return res.render('instructors', {data: instructors});
            })
        
    });     
// POST ROUTES for Instructors page
app.post('/add-instructor-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO instructors (instructor_id, first_name, last_name, email) 
    VALUES ('${data.instructor_id}', '${data.first_name}', '${data.last_name}', '${data.email}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        
        else
        {
            // If there was no error, perform a SELECT * on instructors
            query2 = `SELECT * FROM instructors;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});
// DELETE ROUTES for Instructors page
app.delete('/delete-instructor-ajax/', function(req,res,next){
    let data = req.body;
    let instructorID = parseInt(data.instructor_id);
    let deleteInstructors= `DELETE FROM instructors WHERE instructor_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteInstructors, [instructorID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteInstructors, [instructorID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});
// PUT ROUTES for Instructors page
app.put('/put-instructor-ajax', function(req,res,next){
    let data = req.body;

    let first_name = data.first_name;
    let last_name = data.last_name;
    let email = data.email;
    let instructor = parseInt(data.instructor_details);
    // This update part is wholly my own work
    let queryUpdateInstructor = `UPDATE instructors 
    SET first_name = CASE WHEN ? <> '' THEN ? ELSE first_name END,
    last_name = CASE WHEN ? <> '' THEN ? ELSE last_name END,
    email = CASE WHEN ? <> '' THEN ? ELSE email END
    WHERE instructors.instructor_id = ?`;
    let selectInstructor = `SELECT * FROM instructors WHERE instructor_id = ?`

    // Run the 1st query
    db.pool.query(queryUpdateInstructor, [first_name, first_name, last_name, last_name, email, email, instructor], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the classes
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectInstructor, [instructor], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } 
                else {
                    res.send(rows);
                }
            })
                
        }
    })
    }
    );

// GET ROUTES for Students page
app.get('/students', function(req, res)
    {  
        let query1;               // Define our query

        // If there is no query string, we just perform a basic SELECT
        if (req.query.last_name === undefined)
        {
            query1 = "SELECT * FROM students;";
        }

        // If there is a query string, we assume this is a search, and return desired results
        else
        {
            query1 = `SELECT * FROM students WHERE last_name LIKE "${req.query.last_name}%"`
        }

        db.pool.query(query1, function(error, rows, fields){
        
            // Save the people
            let students = rows;
            
            return res.render('students', {data: students});
            })
        
    });     
// POST ROUTES for Students page
app.post('/add-student-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO students (student_id, first_name, last_name, email, pin) 
    VALUES ('${data.student_id}', '${data.first_name}', '${data.last_name}', '${data.email}', '${data.pin}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        
        else
        {
            // If there was no error, perform a SELECT * on students
            query2 = `SELECT * FROM students;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// DELETE ROUTES for Studentes page
app.delete('/delete-student-ajax/', function(req,res,next){
    let data = req.body;
    let studentID = parseInt(data.student_id);
    let deleteStudents= `DELETE FROM students WHERE student_id = ?`;
    // code for M:M table
    let deleteRegistrations = `DELETE FROM registrations WHERE registrations.student_id = ?`;
  
          // Run the 1st query to delete at child table
          db.pool.query(deleteRegistrations, [studentID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteStudents, [studentID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});
// PUT ROUTES for Students page
app.put('/put-student-ajax', function(req,res,next){
    let data = req.body;

    let first_name = data.first_name;
    let last_name = data.last_name;
    let email = data.email;
    let pin = data.pin;
    let student = parseInt(data.student_details);

    let queryUpdateStudent = `UPDATE students 
    SET first_name = CASE WHEN ? <> '' THEN ? ELSE first_name END,
    last_name = CASE WHEN ? <> '' THEN ? ELSE last_name END,
    email = CASE WHEN ? <> '' THEN ? ELSE email END,
    pin = CASE WHEN ? <> '' THEN ? ELSE pin END
    WHERE students.student_id = ?`;
    let selectStudent = `SELECT * FROM students WHERE student_id = ?`

    // Run the 1st query
    db.pool.query(queryUpdateStudent, [first_name, first_name, last_name, last_name, email, email, pin, pin, student], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the students
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectStudent, [student], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } 
                else {
                    res.send(rows);
                }
            })
                
        }
    })
    }
);

// GET ROUTES for Registrations page
app.get('/registrations', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.last_name === undefined)
    {
        query1 = "SELECT * FROM registrations;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT registrations.registration_id, registrations.student_id, registrations.year, registrations.quarter FROM registrations INNER JOIN students ON registrations.student_id = students.student_id WHERE students.last_name LIKE "${req.query.last_name}%"`
    }


    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM students;";
    
    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the people
        let registrations = rows;
        
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the registrations
            let students = rows;

            let studentmap = {}
            students.map(student => {
                let id = parseInt(student.student_id, 10);

                studentmap[id] = student["student_id"] + " " + student["first_name"] + " " + student["last_name"];
            })

            // Overwrite the homeworld ID with the name of the planet in the people object
            registrations = registrations.map(registration => {
                return Object.assign(registration, {student_id: studentmap[registration.student_id]})
            })

            // END OF NEW CODE
            return res.render('registrations', {data: registrations, students: students});
        })
    })
});
// POST ROUTES for Registrations page
app.post('/add-registration-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO registrations (registration_id, student_id, year, quarter) 
    VALUES ('${data.registration_id}', '${data.student_id}', '${data.year}', '${data.quarter}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        
        else
        {
            // If there was no error, perform a SELECT * on registrations
            query2 = `SELECT * FROM registrations;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});
// DELETE ROUTES for Registrations page
app.delete('/delete-registration-ajax/', function(req,res,next){
    let data = req.body;
    let registrationID = parseInt(data.registration_id);
    // code for M:M table
    let deleteRegistrationDetails = `DELETE FROM registration_details WHERE registration_details.registration_id = ?`; 
    let deleteRegistrations= `DELETE FROM registrations WHERE registration_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteRegistrationDetails, [registrationID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteRegistrations, [registrationID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});
// PUT ROUTES for Registrations page
app.put('/put-registration-ajax', function(req,res,next){
    let data = req.body;

    let registration_id = parseInt(data.registration_id);
    let year = data.year;
    let quarter = data.quarter;
    // This update part is wholly my own work
    let queryUpdateReg = `UPDATE registrations 
    SET year = CASE WHEN ? <> '' THEN ? ELSE year END,
    quarter = CASE WHEN ? <> '' THEN ? ELSE quarter END
    WHERE registrations.registration_id = ?`;
    let selectRegistration = `SELECT * FROM registrations WHERE registration_id = ?`
    
    // Run the 1st query
    db.pool.query(queryUpdateReg, [year, year, quarter, quarter, registration_id], function(error, rows, fields){
        if (error) {
    
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
    
        // If there was no error, we run our second query and return that data so we can use it to update the registrations
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectRegistration, [registration_id], function(error, rows, fields) {
    
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } 
                else {
                    res.send(rows);
                }
            })
                
        }
    })
    }
    );

// GET ROUTES for Registration Details page
app.get('/registrationdetails', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.registration_id === undefined)
    {
        query1 = "SELECT * FROM registration_details;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    // This search based on multiple queries is my own work
    else
    {
        query1 = `SELECT registration_details.registration_details_id, registration_details.registration_id, registration_details.class_id 
        FROM registration_details 
        INNER JOIN registrations on registration_details.registration_id = registrations.registration_id 
        INNER JOIN students on registrations.student_id = students.student_id
        WHERE registration_details.registration_id LIKE COALESCE("${req.query.registration_id}%",registration_details.registration_id)
        AND students.last_name LIKE COALESCE("${req.query.student_last_name}%", students.last_name)`
    }

    // Query 2 to display class dropdown in the Add section
    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM classes;";
    let query3 = "SELECT * FROM registrations;";
    
    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the registration_details to rows
        let registration_details = rows;
        
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the registrations
            let classes = rows;
            // mapping to display the Class Name dynamically in the registration details table
            let classmap = {}
            classes.map(aclass => {
                let id = parseInt(aclass.class_id, 10);

                classmap[id] = aclass["class_id"] + " " + aclass["class_name"] + " " + aclass["year"] + " " + aclass["quarter"];
            })

            // Overwrite the homeworld ID with the name of the planet in the people object
            registration_details = registration_details.map(registration_detail => {
                return Object.assign(registration_detail, {class_id: classmap[registration_detail.class_id]})
            })
            db.pool.query(query3, (error, rows, fields) => {
                let registrations = rows;
                return res.render('registrationdetails', {data: registration_details, registrations: registrations, classes: classes});
            })
            
        })
    })
});
// POST ROUTES for Registration Details page
app.post('/add-registration_detail-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    // Create the query and run it on the database
    query1 = `INSERT INTO registration_details (registration_details_id, registration_id, class_id) 
    VALUES ('${data.registration_details_id}', '${data.registration_id}', '${data.class_id}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        
        else
        {
            // If there was no error, perform a SELECT * on registrations
            query2 = `SELECT * FROM registration_details;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});
// DELETE ROUTES for Registration Details page
app.delete('/delete-registration_detail-ajax/', function(req,res,next){
    let data = req.body;
    let registrationDetailsID = parseInt(data.registration_details_id);

    let deleteRegistrations= `DELETE FROM registration_details WHERE registration_details_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteRegistrations, [registrationDetailsID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                res.sendStatus(204);
              }
  })});
// PUT ROUTES for Registrations page
app.put('/put-registration_detail-ajax', function(req,res,next){
    let data = req.body;
    
    let registration_details_id = parseInt(data.registration_details_id)
    let registration_id = data.registration_id;
    let class_id = data.class_id;
    // This update part is wholly my own work
    let queryUpdateRegDetail = `UPDATE registration_details 
    SET registration_id = CASE WHEN ? <> '' THEN ? ELSE registration_id END,
    class_id = CASE WHEN ? <> '' THEN ? ELSE class_id END
    WHERE registration_details.registration_details_id = ?`;
    let selectRegistrationDetail = `SELECT * FROM registration_details WHERE registration_details_id = ?`
    
    // Run the 1st query
    db.pool.query(queryUpdateRegDetail, [registration_id, registration_id, class_id, class_id, registration_details_id], function(error, rows, fields){
        if (error) {
    
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
    
        // If there was no error, we run our second query and return that data so we can use it to update the registrations
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectRegistrationDetail, [registration_details_id], function(error, rows, fields) {
    
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } 
                else {
                    res.send(rows);
                }
            })
                
        }
    })
    }
    );

// GET ROUTES for Sections page
app.get('/sections', function(req, res)
{
    let query1;
    if (req.query.section === undefined)
    {
        query1 = "SELECT * FROM sections;";
    }
    else
    {
        query1 = `SELECT * FROM sections WHERE section LIKE "${req.query.section}%"`
    }

    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.render('sections', {data: rows});
        }
    })
});

// POST ROUTES for Sections page
app.post('/add-section-ajax', function(req, res) 
{
    let data = req.body;

    let query1 = `INSERT INTO sections (section, method) VALUES ('${data.section}', '${data.method}')`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            let query2 = `SELECT * FROM sections;`;
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

// DELETE ROUTES for Sections page
app.delete('/delete-section-ajax/', function(req,res,next){
    let data = req.body;
    let section = data.section;
    let deleteSection = `DELETE FROM sections WHERE section = ?`;

    db.pool.query(deleteSection, [section], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});
  
// PUT ROUTES for Sections page
app.put('/put-section-ajax', function(req,res,next){
    let data = req.body;
    let section = data.section;
    let method = data.method;

    let queryUpdateSection = `UPDATE sections SET method = ? WHERE sections.section = ?`;
    let selectSection = `SELECT * FROM sections WHERE section = ?`

    db.pool.query(queryUpdateSection, [method, section], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(selectSection, [section], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })    
        }
    })
});

// GET ROUTES for Departments page
app.get('/departments', function(req, res)
{
    let query1;
    if (req.query.department_name === undefined)
    {
        query1 = "SELECT * FROM departments;";
    }
    else
    {
        query1 = `SELECT * FROM departments WHERE department_name LIKE "${req.query.department_name}%"`
    }

    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.render('departments', {data: rows});
        }
    })
});

// POST ROUTES for Departments page
app.post('/add-department-ajax', function(req, res) 
{
    let data = req.body;

    let query1 = `INSERT INTO departments (department_id, department_name) VALUES ('${data.department_id}', '${data.department_name}')`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            let query2 = `SELECT * FROM departments;`;
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});
  
// PUT ROUTES for Departments page
app.put('/put-department-ajax', function(req,res,next){
    let data = req.body;
    let department_id = data.department_id;
    let department_name = data.department_name;

    let queryUpdateDepartment = `UPDATE departments SET department_name = ? WHERE departments.department_id = ?`;
    let selectDepartmentName = `SELECT * FROM departments WHERE department_name = ?`

    db.pool.query(queryUpdateDepartment, [department_name, department_id], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(selectDepartmentName, [department_name], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })    
        }
    })
});

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});