import React, { forwardRef } from 'react';

const TranscriptTemplate = forwardRef(({ data }, ref) => {
  return (
    <div ref={ref} style={{ 
        fontFamily: "'Times New Roman', Times, serif", 
        lineHeight: 1.6, 
        padding: '40px', 
        color: '#333',
        backgroundColor: 'white',
        width: '800px',
        minHeight: '1000px',
        boxSizing: 'border-box'
    }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#50212f' }}>{data.universityName}</h1>
            <h2 style={{ margin: '5px 0', fontSize: '20px', fontWeight: 'normal' }}>Office of the University Registrar</h2>
            <h3 style={{ margin: '5px 0' }}>Academic Transcript</h3>
        </div>

        <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                    <tr>
                        <td style={{ padding: '4px 8px' }}><strong>Name:</strong></td>
                        <td style={{ padding: '4px 8px' }}>{data.studentName}</td>
                        <td style={{ padding: '4px 8px' }}><strong>Student ID:</strong></td>
                        <td style={{ padding: '4px 8px' }}>{data.studentID}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '4px 8px' }}><strong>Date Issued:</strong></td>
                        <td style={{ padding: '4px 8px' }}>{data.issueDate}</td>
                        <td style={{ padding: '4px 8px' }}><strong>Program:</strong></td>
                        <td style={{ padding: '4px 8px' }}>{data.program}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '4px 8px' }}><strong>College:</strong></td>
                        <td style={{ padding: '4px 8px' }}>{data.college}</td>
                        <td style={{ padding: '4px 8px' }}><strong>Major:</strong></td>
                        <td style={{ padding: '4px 8px' }}>{data.major}</td>
                    </tr>
                </tbody>
            </table>
        </div>

            <div>
            <div style={{ backgroundColor: '#e0e0e0', fontWeight: 'bold', padding: '10px', marginTop: '20px' }}>{data.term}</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Course</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Description</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Grade</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Hours</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Quality Pts</th>
                    </tr>
                </thead>
                <tbody>
                    {data.courses && data.courses.current ? data.courses.current.map((course, idx) => (
                        <tr key={idx}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.code}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.name}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.grade}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.hours}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.qualityPoints}</td>
                        </tr>
                    )) : (
                        <tr><td colSpan="5" style={{ border: '1px solid #ddd', padding: '8px' }}>No course data generated</td></tr>
                    )}
                </tbody>
            </table>
            {data.stats && data.stats.current && (
            <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                <tbody>
                    <tr>
                        <td style={{ padding: '2px 8px' }}><strong>Term Totals:</strong></td>
                        <td style={{ padding: '2px 8px' }}>Attempted: {data.stats.current.attempted.toFixed(2)}</td>
                        <td style={{ padding: '2px 8px' }}>Earned: {data.stats.current.earned.toFixed(2)}</td>
                        <td style={{ padding: '2px 8px' }}>GPA Hours: {data.stats.current.attempted.toFixed(2)}</td>
                        <td style={{ padding: '2px 8px' }}>Quality Points: {data.stats.current.qualityPoints.toFixed(2)}</td>
                        <td style={{ padding: '2px 8px' }}><strong>Term GPA: {data.stats.current.gpa}</strong></td>
                    </tr>
                </tbody>
            </table>
            )}

            <div style={{ backgroundColor: '#e0e0e0', fontWeight: 'bold', padding: '10px', marginTop: '20px' }}>Spring 2025</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Course</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Description</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Grade</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Hours</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Quality Pts</th>
                    </tr>
                </thead>
                 <tbody>
                    {data.courses && data.courses.next ? data.courses.next.map((course, idx) => (
                        <tr key={idx}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.code}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.name}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.grade}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.hours}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.qualityPoints}</td>
                        </tr>
                    )) : (
                        <tr><td colSpan="5" style={{ border: '1px solid #ddd', padding: '8px' }}>No course data generated</td></tr>
                    )}
                </tbody>
            </table>
            {data.stats && data.stats.next && (
            <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                <tbody>
                    <tr>
                        <td style={{ padding: '2px 8px' }}><strong>Term Totals:</strong></td>
                        <td style={{ padding: '2px 8px' }}>Attempted: {data.stats.next.attempted.toFixed(2)}</td>
                        <td style={{ padding: '2px 8px' }}>Earned: {data.stats.next.earned.toFixed(2)}</td>
                        <td style={{ padding: '2px 8px' }}>GPA Hours: {data.stats.next.attempted.toFixed(2)}</td>
                        <td style={{ padding: '2px 8px' }}>Quality Points: {data.stats.next.qualityPoints.toFixed(2)}</td>
                        <td style={{ padding: '2px 8px' }}><strong>Term GPA: {data.stats.next.gpa}</strong></td>
                    </tr>
                </tbody>
            </table>
            )}
            
            <div style={{ marginTop: '25px', borderTop: '2px solid #333', paddingTop: '10px' }}>
                {data.stats && data.stats.cumulative && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                     <tbody>
                     <tr>
                        <td style={{ padding: '2px 8px' }}><strong>Cumulative Totals:</strong></td>
                        <td style={{ padding: '2px 8px' }}>Attempted: {data.stats.cumulative.attempted}</td>
                        <td style={{ padding: '2px 8px' }}>Earned: {data.stats.cumulative.earned}</td>
                        <td style={{ padding: '2px 8px' }}>GPA Hours: {data.stats.cumulative.attempted}</td>
                        <td style={{ padding: '2px 8px' }}>Quality Points: {data.stats.cumulative.qualityPoints}</td>
                        <td style={{ padding: '2px 8px' }}><strong>Cumulative GPA: {data.stats.cumulative.gpa}</strong></td>
                    </tr>
                     <tr>
                        <td style={{ padding: '2px 8px' }}><strong>Academic Standing:</strong></td>
                        <td colSpan="5" style={{ padding: '2px 8px' }}>Good Standing</td>
                    </tr>
                    </tbody>
                </table>
                )}
            </div>
        </div>

        <div style={{ marginTop: '40px', fontStyle: 'italic', fontSize: '12px', color: '#666', textAlign: 'center' }}>
            *** END OF TRANSCRIPT ***
        </div>
    </div>
  );
});

export default TranscriptTemplate;
