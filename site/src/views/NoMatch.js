import React from 'react';
import { LayoutParams } from '../components/LayoutParams';

export const NoMatch = () => (
    <div style={{ textAlign: 'center' }}>
        <div>
            <br />
            <br />
            <br />
            <span style={{ fontSize: 16, fontWeight: 500, color: LayoutParams.colors.corDoTextoPadrao }}>
                Nada encontrado aqui...
            </span>
            <br />
        </div>
    </div>
);
