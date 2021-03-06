import React from 'react';
import '../scss/RecordItem.scss';

class RecordItem extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            /**
             * dragging: true/(false/undefined)
             */
        };

        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
    }

    mouseMove (e) {
        const dragging = this.state.dragging;
        dragging.rect.x = e.clientX;
        dragging.rect.y = e.clientY;
        this.setState({
            dragging
        });
        this.props.dragMove({ x: e.clientX, y: e.clientY });
    }

    mouseUp (e) {
        this.setState({ dragging: null });
        this.props.dragEnd({ x: e.clientX, y: e.clientY }, this.props.data);
    }

    componentWillUpdate (nextProps, nextState) {
        if (nextState.dragging) {
            document.addEventListener('mousemove', this.mouseMove);
            document.addEventListener('mouseup', this.mouseUp);
        } else {
            document.removeEventListener('mousemove', this.mouseMove);
            document.removeEventListener('mouseup', this.mouseUp);
        }
    }

    render () {
        let dragging = null;
        if (this.state.dragging) {
            dragging = <div className="record-item-container drag-item"
                style={{
                    top: this.state.dragging.rect.y + this.state.dragging.mouseDiff.y,
                    left: this.state.dragging.rect.x + this.state.dragging.mouseDiff.x,
                    width: this.state.dragging.rect.width,
                    height: this.state.dragging.rect.height
                }} draggable="true">
                <RecordDetails data={this.props.data} removable="false"></RecordDetails>
            </div>;
        }

        let classes = 'record-item-container';
        classes += this.state.dragging ? ' dragging' : '';
        return <div className={classes} draggable="true" onDragStart={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseDiff = { x: rect.x - e.clientX, y: rect.y - e.clientY };
            this.setState({
                dragging: {
                    rect: e.currentTarget.getBoundingClientRect(),
                    mouseDiff
                }
            });

            e.preventDefault();
        }}>
            {dragging}
            <RecordDetails removable={this.props.removable} data={this.props.data} removeFromList={this.props.removeFromList}></RecordDetails>
        </div>;
    }
}

export default RecordItem;

class RecordDetails extends React.PureComponent {
    render () {
        return <div>
            { this.props.removable
                ? <span className="remove-button" onClick={() => this.props.removeFromList(this.props.data)}>Remove from list</span>
                : null }
            <img className="record-item-img" src={this.props.data.basic_information.cover_image === '' ? '/images/vinyl-default.jpg' : this.props.data.basic_information.cover_image} alt=""></img>
            <span className="record-item-name">{this.props.data.basic_information.title}</span>
            <span className="record-item-artists">{this.props.data.basic_information.artists.map(a => a.name).join(',')}</span>
            <span className="record-item-formats">Format: {this.props.data.basic_information.formats.map(a => a.name).join(',')}</span>
            <span className="record-item-labels">Labels: {this.props.data.basic_information.labels.map(a => a.name).join(',')}</span>
            <span className="record-item-date">Date:{this.props.data.basic_information.year}</span>
        </div>;
    }
}
