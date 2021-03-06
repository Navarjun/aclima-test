import React from 'react';
import RecordItem from './RecordItem';
import '../scss/RecordsGrid.scss';

class RecordsGrid extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            /**
             * dragging: index
             */
        };
    }

    render () {
        let items = this.props.records.map((record, i) => {
            return <li className="record-item-wrapper" key={i}>
                <RecordItem removable={this.props.removable} data={record} dragEnd={this.props.dragEnd} dragMove={this.props.dragMove} removeFromList={this.props.removeFromList}/>
            </li>;
        });

        return <div className="records-grid-container">
            <ul className="records-grid">
                {items}
            </ul>
        </div>;
    }
}

export default RecordsGrid;
