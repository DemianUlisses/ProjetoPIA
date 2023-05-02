import React, { Component } from 'react';
import SessionManager from './../scripts/SessionManager';

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
		this.sessionManager = new SessionManager();
	}

	render() {
		return (
			<div>
				<div style={{ display: 'flex', flexDirection: 'row', overflowX: 'hidden' }}>
					<div style={{ flexBasis: '100%' }}>
						<div>
							<div
								style={{
									fontSize: 15,
									display: 'flex',
									justifyContent: 'center',
									flexDirection: 'row',
									flexWrap: 'wrap',
									padding: '20px 5px 0px 5px',
									overflow: 'hidden',
								}}
							>
							</div>
						</div>
					</div>					
				</div>
			</div>
		);
	}
}
