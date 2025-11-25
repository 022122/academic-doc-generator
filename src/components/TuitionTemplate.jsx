import React, { forwardRef } from 'react';

const TuitionTemplate = forwardRef(({ data }, ref) => {
  return (
    <div ref={ref} style={{ 
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
        lineHeight: 1.6, 
        padding: '40px', 
        color: '#212529',
        backgroundColor: 'white',
        width: '800px', // Fixed width for consistency
        minHeight: '1000px',
        boxSizing: 'border-box'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #50212f', paddingBottom: '15px', marginBottom: '20px' }}>
            <div className="logo-text">
                <h1 style={{ margin: 0, fontSize: '26px', color: '#50212f' }}>{data.universityName}</h1>
                <p style={{ margin: 0, fontSize: '14px' }}>Student Business Services</p>
            </div>
            <div style={{ textAlign: 'right' }}>
                <strong>ACCOUNT STATEMENT</strong><br />
                Statement Date: {data.statementDate}<br />
                Payment Due Date: {data.dueDate}
            </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                    <tr>
                        <td style={{ padding: '5px 0' }}><strong>To:</strong></td>
                        <td style={{ padding: '5px 0' }}>{data.studentName}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '5px 0' }}></td>
                        <td style={{ padding: '5px 0' }}>{data.address}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '5px 0' }}><strong>Student ID:</strong></td>
                        <td style={{ padding: '5px 0' }}>{data.studentID}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '5px 0' }}><strong>Term:</strong></td>
                        <td style={{ padding: '5px 0' }}>{data.term}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th style={{ padding: '12px 15px', backgroundColor: '#f2f2f2', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>Description</th>
                    <th style={{ padding: '12px 15px', backgroundColor: '#f2f2f2', borderBottom: '2px solid #dee2e6', textAlign: 'right' }}>Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6', width: '70%' }}>Tuition - Undergraduate (Non-Resident) - 15 Hours</td>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6', textAlign: 'right' }}>{data.tuition ? data.tuition.base : '$9,555.00'}</td>
                </tr>
                <tr>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6' }}>Differential Tuition - {data.college}</td>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6', textAlign: 'right' }}>{data.tuition ? data.tuition.differential : '$975.00'}</td>
                </tr>
                <tr>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6' }}>Student Service Fee</td>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6', textAlign: 'right' }}>$340.00</td>
                </tr>
                <tr>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6' }}>Computer Service Fee</td>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6', textAlign: 'right' }}>$210.00</td>
                </tr>
                <tr>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6' }}>Library Fee</td>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6', textAlign: 'right' }}>$150.00</td>
                </tr>
                <tr>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6' }}>Medical Fee</td>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6', textAlign: 'right' }}>$95.00</td>
                </tr>
                <tr>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6' }}>Other Required University Fees</td>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6', textAlign: 'right' }}>$680.00</td>
                </tr>
                <tr>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6' }}>International Student Operations Fee</td>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6', textAlign: 'right' }}>$75.00</td>
                </tr>
                <tr>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6' }}>International Student Health Insurance</td>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6', textAlign: 'right' }}>$1,650.00</td>
                </tr>
            </tbody>
        </table>

        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #dee2e6', textAlign: 'right' }}>
            <table style={{ width: '40%', marginLeft: 'auto' }}>
                <tbody>
                    <tr>
                        <td style={{ padding: '5px' }}>Total Charges:</td>
                        <td style={{ padding: '5px', textAlign: 'right' }}>{data.tuition ? data.tuition.total : '$13,730.00'}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '5px' }}>Payments/Credits (as of {data.statementDate}):</td>
                        <td style={{ padding: '5px', textAlign: 'right' }}>({data.tuition ? data.tuition.total : '$13,730.00'})</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '5px', fontWeight: 'bold', fontSize: '18px', color: '#50212f' }}>BALANCE DUE:</td>
                        <td style={{ padding: '5px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px', color: '#50212f' }}>$0.00</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style={{ marginTop: '40px', fontSize: '12px', color: '#6c757d', textAlign: 'center' }}>
            Thank you for your payment. This statement reflects account activity as of the date indicated. <br />
            For questions, please contact Student Business Services.
        </div>
    </div>
  );
});

export default TuitionTemplate;
