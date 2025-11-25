import { faker } from '@faker-js/faker';

export const generateRandomData = () => {
  // Generate a past date for statement
  const statementDate = faker.date.past({ years: 0.5 });
  // Due date is typically 2-4 weeks after statement
  const dueDate = new Date(statementDate);
  dueDate.setDate(dueDate.getDate() + faker.number.int({ min: 14, max: 30 }));
  
  // Issue date typically current or very recent
  const issueDate = faker.date.recent({ days: 5 });
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  // Common Texas/US universities to choose from if desired, or just generic
  const university = "Hajimi University"; 

  // Course Data Pool based on Major
  const majors = [
    { name: "Computer Science", college: "College of Science and Engineering", program: "Bachelor of Science", prefix: "CS" },
    { name: "Business Administration", college: "McCoy College of Business", program: "Bachelor of Business Admin", prefix: "BA" },
    { name: "Psychology", college: "College of Liberal Arts", program: "Bachelor of Arts", prefix: "PSY" },
    { name: "Biology", college: "College of Science and Engineering", program: "Bachelor of Science", prefix: "BIO" },
    { name: "Marketing", college: "McCoy College of Business", program: "Bachelor of Business Admin", prefix: "MKT" },
  ];

  const selectedMajor = faker.helpers.arrayElement(majors);

  // Generate random courses logic
  const generateCourses = (majorPrefix, term) => {
    const commonCourses = [
        { code: "ENG 1310", name: "College Writing I", hours: 3 },
        { code: "ENG 1320", name: "College Writing II", hours: 3 },
        { code: "HIST 1310", name: "History of US to 1877", hours: 3 },
        { code: "POSI 2310", name: "Principles of American Govt", hours: 3 },
        { code: "COMM 1310", name: "Fund. of Human Communication", hours: 3 },
        { code: "PHIL 1305", name: "Philosophy & Critical Thinking", hours: 3 },
        { code: "ART 2313", name: "Introduction to Fine Arts", hours: 3 },
    ];

    const majorCoursesPool = {
        "CS": [
            { code: "CS 1428", name: "Foundations of Computer Science I", hours: 4 },
            { code: "CS 2308", name: "Foundations of Computer Science II", hours: 3 },
            { code: "CS 3358", name: "Data Structures", hours: 3 },
            { code: "MATH 2471", name: "Calculus I", hours: 4 },
            { code: "MATH 2358", name: "Discrete Mathematics I", hours: 3 },
        ],
        "BA": [
            { code: "MGT 3303", name: "Management of Organizations", hours: 3 },
            { code: "MKT 3343", name: "Principles of Marketing", hours: 3 },
            { code: "ACC 2361", name: "Intro to Financial Accounting", hours: 3 },
            { code: "ECO 2314", name: "Principles of Microeconomics", hours: 3 },
            { code: "FIN 3312", name: "Business Finance", hours: 3 },
        ],
        "PSY": [
            { code: "PSY 1300", name: "Introduction to Psychology", hours: 3 },
            { code: "PSY 3300", name: "Lifespan Development", hours: 3 },
            { code: "PSY 3322", name: "Brain and Behavior", hours: 3 },
            { code: "SOC 1310", name: "Introduction to Sociology", hours: 3 },
            { code: "PSY 3341", name: "Cognitive Processes", hours: 3 },
        ],
        "BIO": [
            { code: "BIO 1330", name: "Functional Biology", hours: 3 },
            { code: "BIO 1130", name: "Functional Biology Lab", hours: 1 },
            { code: "CHEM 1341", name: "General Chemistry I", hours: 3 },
            { code: "CHEM 1141", name: "General Chemistry I Lab", hours: 1 },
            { code: "BIO 2450", name: "Genetics", hours: 4 },
        ],
        "MKT": [
            { code: "MKT 3350", name: "Consumer Behavior", hours: 3 },
            { code: "MKT 3358", name: "Professional Selling", hours: 3 },
            { code: "MKT 4330", name: "Promotional Strategy", hours: 3 },
            { code: "BLAW 2361", name: "Legal Environment of Business", hours: 3 },
            { code: "QMST 2333", name: "Business Statistics", hours: 3 },
        ]
    };

    // Mix 2-3 major courses with 2-3 common courses for realism
    const numMajor = faker.number.int({ min: 2, max: 3 });
    const numCommon = 5 - numMajor;
    
    const myMajorCourses = faker.helpers.arrayElements(majorCoursesPool[majorPrefix], numMajor);
    const myCommonCourses = faker.helpers.arrayElements(commonCourses, numCommon);
    
    const combined = [...myMajorCourses, ...myCommonCourses];
    
    // Generate Grades and Quality Points
    return combined.map(c => {
        const gradePool = ['A', 'A', 'A', 'A', 'B', 'B']; // Heavily skew towards A and B to ensure passing and realistic "good student" GPA
        const grade = faker.helpers.arrayElement(gradePool);
        let pointsPerHour = 0;
        if(grade === 'A') pointsPerHour = 4;
        else if(grade === 'B') pointsPerHour = 3;
        else if(grade === 'C') pointsPerHour = 2;
        else if(grade === 'D') pointsPerHour = 1;
        
        return {
            ...c,
            grade: grade,
            qualityPoints: (c.hours * pointsPerHour).toFixed(2),
            hours: c.hours.toFixed(2)
        };
    });
  };

  const termCourses = generateCourses(selectedMajor.prefix, "Fall 2024");
  const springCourses = generateCourses(selectedMajor.prefix, "Spring 2025");

  // Calculate GPA logic
  const calculateTermStats = (courses) => {
    const attempted = courses.reduce((acc, c) => acc + parseFloat(c.hours), 0);
    const earned = attempted; // Assuming no Fs
    const qualityPoints = courses.reduce((acc, c) => acc + parseFloat(c.qualityPoints), 0);
    const gpa = (qualityPoints / attempted).toFixed(2);
    return { attempted, earned, qualityPoints, gpa };
  };

  const fallStats = calculateTermStats(termCourses);
  const springStats = calculateTermStats(springCourses);
  
  // Cumulative (mock previous data + current)
  const prevHours = faker.number.int({ min: 15, max: 60 });
  const prevGpa = faker.number.float({ min: 3.2, max: 4.0 }); // Ensure previous GPA is solid (above 3.2)
  const prevPoints = prevHours * prevGpa;
  
  const cumAttempted = prevHours + fallStats.attempted + springStats.attempted;
  const cumPoints = prevPoints + fallStats.qualityPoints + springStats.qualityPoints;
  const cumGpa = (cumPoints / cumAttempted).toFixed(2);

  // Tuition Data Logic
  // Base tuition around 9500, slightly random but rounded to whole number
  const baseTuition = faker.number.int({ min: 9400, max: 9800 });
  
  // Differential tuition depends on college (mock logic)
  let diffTuition = 0;
  if (selectedMajor.college.includes("Business")) diffTuition = 1100;
  else if (selectedMajor.college.includes("Science")) diffTuition = 975;
  else diffTuition = 850;
  
  const fees = {
      studentService: 340,
      computerService: 210,
      library: 150,
      medical: 95,
      other: 680,
      intlOps: 75,
      insurance: 1650
  };
  
  const totalFees = Object.values(fees).reduce((a, b) => a + b, 0) + diffTuition;
  const totalCharges = baseTuition + totalFees;

  return {
    universityName: university,
    studentName: `${lastName} ${firstName}`, 
    studentID: `${faker.string.numeric(6)}-${faker.string.numeric(4)}`,
    address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()}`,
    term: "Fall 2024", 
    major: selectedMajor.name, 
    program: selectedMajor.program,
    college: selectedMajor.college,
    statementDate: formatDate(statementDate),
    dueDate: formatDate(dueDate),
    issueDate: formatDate(issueDate),
    tuition: {
        base: baseTuition.toLocaleString('en-US', {style: 'currency', currency: 'USD'}),
        differential: diffTuition.toLocaleString('en-US', {style: 'currency', currency: 'USD'}),
        fees: fees,
        total: totalCharges.toLocaleString('en-US', {style: 'currency', currency: 'USD'})
    },
    courses: {
        current: termCourses,
        next: springCourses
    },
    stats: {
        current: fallStats,
        next: springStats,
        cumulative: {
            attempted: cumAttempted.toFixed(2),
            earned: cumAttempted.toFixed(2),
            qualityPoints: cumPoints.toFixed(2),
            gpa: cumGpa
        }
    }
  };
};
