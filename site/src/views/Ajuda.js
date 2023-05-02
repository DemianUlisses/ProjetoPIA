import React from 'react';
import { LayoutParams } from '../components/LayoutParams';

export const Ajuda = () => (
    <div>
        <div style={{ textAlign: 'left', width: 310, margin: 'auto' }}>
            <div>
                <br />
                <span style={{ fontSize: 16, fontWeight: 500, color: LayoutParams.colors.corSecundaria }}>
                    Regulamento
                </span>
                <br />
                <span style={{ fontSize: 16, fontWeight: 500 }}>
                    <a
                        style={{ textDecoration: 'none', color: LayoutParams.colors.corDoTextoPadrao }}
                        href='http://ojogodabolsa.com.br/regulamento'
                        target='_blank' rel="noopener noreferrer"
                    >
                        http://ojogodabolsa.com.br/regulamento
                    </a>
                </span>
                <br />
                <br />
                <span style={{ fontSize: 16, fontWeight: 500, color: LayoutParams.colors.corSecundaria }}>
                    Premiações
                </span>
                <br />
                <span style={{ fontSize: 16, fontWeight: 500 }}>
                    <a
                        style={{ textDecoration: 'none', color: LayoutParams.colors.corDoTextoPadrao }}
                        href='http://ojogodabolsa.com.br/premiacoes'
                        target='_blank' rel="noopener noreferrer"
                    >
                        http://ojogodabolsa.com.br/premiacoes
                    </a>
                </span>
                <br />
                <br />
                <span style={{ fontSize: 16, fontWeight: 500, color: LayoutParams.colors.corSecundaria }}>FAQ</span>
                <br />
                <span style={{ fontSize: 16, fontWeight: 500 }}>
                    <a
                        style={{ textDecoration: 'none', color: LayoutParams.colors.corDoTextoPadrao }}
                        href='http://ojogodabolsa.com.br/faq'
                        target='_blank' rel="noopener noreferrer"
                    >
                        http://ojogodabolsa.com.br/faq
                    </a>
                </span>
                <br />
                <br />
                <span style={{ fontSize: 16, fontWeight: 500, color: LayoutParams.colors.corSecundaria }}>Contato</span>
                <br />
                <span style={{ fontSize: 16, fontWeight: 500 }}>
                    <a
                        style={{ textDecoration: 'none', color: LayoutParams.colors.corDoTextoPadrao }}
                        href='http://ojogodabolsa.com.br/contato'
                        target='_blank' rel="noopener noreferrer"
                    >
                        http://ojogodabolsa.com.br/contato
                    </a>
                </span>
                <br />
            </div>
        </div>
    </div>
);
