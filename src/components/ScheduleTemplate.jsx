import React, { forwardRef } from 'react';

const ScheduleTemplate = forwardRef(({ data }, ref) => {
  return (
    <div ref={ref} style={{ 
        fontFamily: "Arial, sans-serif", 
        lineHeight: 1.5, 
        padding: '40px', 
        color: '#333',
        backgroundColor: 'white',
        width: '800px',
        minHeight: '1000px',
        boxSizing: 'border-box'
    }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#50212f' }}>{data.universityName}</h1>
            <h2 style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'normal' }}>Student Course Schedule</h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', backgroundColor: '#f9f9f9', padding: '10px', border: '1px solid #ddd' }}>
            <div><strong>Student:</strong> {data.studentName}</div>
            <div><strong>Student ID:</strong> {data.studentID}</div>
            <div><strong>Term:</strong> {data.term}</div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
                <tr>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Course</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Description</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Credits</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Days</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Time</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Location</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Instructor</th>
                </tr>
            </thead>
            <tbody>
                {data.courses && data.courses.current ? data.courses.current.map((course, idx) => (
                    <tr key={idx}>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{course.code}</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{course.name}</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{course.hours}</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>Mon, Wed, Fri</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>10:00 AM - 10:50 AM</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>DERR 238</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>Williams, D.</td>
                    </tr>
                )) : (
                    <tr><td colSpan="7" style={{ border: '1px solid #ddd', padding: '10px' }}>No schedule data</td></tr>
                )}
            </tbody>
        </table>
        
        <div style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '10px' }}>
            Total Registered Credits: {data.stats && data.stats.current ? data.stats.current.attempted.toFixed(2) : '0.00'}
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '12px', color: '#777' }}>
            Schedule is subject to change. <br />
        </div>
    </div>
  );
});

export default ScheduleTemplate;
