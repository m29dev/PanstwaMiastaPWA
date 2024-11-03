import React from 'react';
import { useNavigate } from 'react-router-dom';

const CardBox = ({ title, id }) => {
    const navigate = useNavigate()

    return (
        <div style={styles.card} onClick={() => navigate(`/rooms/${id}`)}>
            <div style={styles.content}>
                <h3 style={styles.title}>{title}</h3>
            </div>
        </div>
    );
};

const styles = {
    card: {
        width: '100%',
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease',
        cursor: 'pointer',
        height: '60px',
        minHeight: '60px',
        marginBottom: '14px'
    },
    title: {
        fontSize: '18px',
        color: '#333',
    },
    text: {
        fontSize: '18px',
        color: '#768',
    },
};

export default CardBox
