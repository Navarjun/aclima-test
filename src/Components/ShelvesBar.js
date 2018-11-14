import React from 'react';
import '../scss/ShelvesBar.scss';

class ShelvesBar extends React.PureComponent {
    constructor (props) {
        super(props);

        this.state = {
            isAdding: false
            /**
             * addingInputValue: ''
             */
        };

        this.onAddShelf = this.onAddShelf.bind(this);
        this.add = this.add.bind(this);
        this.cancel = this.cancel.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    onAddShelf () {
        this.setState({ isAdding: true, addingInputValue: '' });
    }

    add () {
        this.props.addShelf(this.state.addingInputValue);
        this.setState({ isAdding: false, addingInputValue: '' });
    }

    cancel () {
        this.setState({ isAdding: false, addingInputValue: '' });
    }

    handleInput (e) {
        this.setState({ addingInputValue: e.currentTarget.value });
    }

    render () {
        const mapFunc = (shelf, i) => {
            let classes = 'shelf-item auto';
            if (+this.props.selectedShelf === +shelf.id) {
                classes += ' selected';
            }
            if (+this.props.potentialShelf === +shelf.id) {
                classes += ' potential';
            }
            return <li className={classes} key={i} data-shelfid={shelf.id} onClick={() => this.props.onShelfSelect(shelf.id)}>
                <div className="shelf-details">
                    <span className="delete-shelf" onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.props.deleteShelf(shelf.id);
                    }}>&#x1f5d1;</span>
                    <span className="shelf-name">{shelf.name}</span>
                    <span className="shelf-items-count">{shelf.records.length} records</span>
                </div>
                <ul className="shelf-items-list">
                    {shelf.records.slice(0, 10).map((record, i) => {
                        return <li key={i} className="shelf-item">
                            <img className="shelf-item-img" src={record.basic_information.cover_image === '' ? '/images/vinyl-default.jpg' : record.basic_information.cover_image} alt=""></img>
                        </li>;
                    })}
                </ul>
            </li>;
        };

        const items = this.props.shelves.map((shelf, i) => mapFunc(shelf, i));

        return <div className="shelves-bar-container">
            <ul className="shelves-list">
                {items}
            </ul>
            <div className='btn-div'>
                { this.state.isAdding ? <input className="form" value={this.state.addingInputValue} onChange={this.handleInput}></input> : null }
                <button className={
                    (this.state.isAdding && this.state.addingInputValue === '') ? 'form btn btn-fail' : 'form btn btn-success'
                } onClick={
                    this.state.isAdding
                        ? (
                            (this.state.addingInputValue === '') ? this.cancel : this.add
                        )
                        : this.onAddShelf
                }>
                    { this.state.isAdding
                        ? (
                            (this.state.addingInputValue === '') ? 'Cancel' : 'Add'
                        )
                        : 'Add Shelf' }
                </button>
            </div>
        </div>;
    }
}

export default ShelvesBar;
