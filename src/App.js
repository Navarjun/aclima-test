/* global XMLHttpRequest */
import React, { Component } from 'react';
import ShelvesBar from './Components/ShelvesBar';
import RecordsGrid from './Components/RecordsGrid';
import './scss/App.scss';

class App extends Component {
    constructor (props) {
        super(props);

        this.state = {
            shelves: [
            ],
            records: [],
            pagesFetched: 0,
            selectedShelf: -1,
            potentialShelf: -1,
            search: ''
        };

        this.dragEnd = this.dragEnd.bind(this);
        this.dragMove = this.dragMove.bind(this);
        this.addShelf = this.addShelf.bind(this);
        this.getRecords = this.getRecords.bind(this);
        this.search = this.search.bind(this);
        this.getRecords();
    }

    getRecords (page = 1) {
        const request = new XMLHttpRequest();
        request.open('GET', 'https://api.discogs.com/users/blacklight/collection/folders/0/releases?per_page=500&page=' + page, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                try {
                    var response = JSON.parse(request.responseText);

                    this.setState({
                        pagesFetched: response.pagination.page,
                        totalPages: response.pagination.pages,
                        records: this.state.records.concat(response.releases)
                    });

                    if (response.pagination.pages !== response.pagination.page) {
                        this.getRecords(++page);
                    }
                } catch (e) {
                }
            } else if (request.readyState === 4 && request.status !== 200) {
            }
        };

        request.send();
    }

    dragEnd (location, record) {
        // console.log(location);
        let shelfId = shelfIdFromPoint(location);
        if (shelfId !== -1) {
            const shelves = this.state.shelves;
            const shelfArr = shelves.filter(s => +s.id === +shelfId);
            if (shelfArr.length > 0) {
                const shelf = shelfArr[0];
                // push item into the shelf
                shelf.records.unshift(record);
                this.setState({ potentialShelf: -1, shelves });
                return;
            }
        }
        this.setState({ potentialShelf: -1 });
    }

    dragMove (location) {
        // console.log(location);
        let shelfId = shelfIdFromPoint(location);
        if (shelfId !== -1) {
            this.setState({ potentialShelf: shelfId });
        } else {
            this.setState({ potentialShelf: -1 });
        }
    }

    addShelf (name) {
        const shelves = this.state.shelves;
        shelves.push({
            id: this.state.shelves.length,
            name: name,
            records: []
        });
        this.setState({
            shelves
        });
    }

    search (records, searchTerm) {
        return records.filter(r => {
            return r.basic_information.title.search(new RegExp(searchTerm, 'i')) !== -1;
        });
    }

    render () {
        let records = this.state.records;
        if (this.state.selectedShelf !== -1) {
            let shelves = this.state.shelves.filter(s => +s.id === this.state.selectedShelf);
            if (shelves.length > 0) {
                let shelf = shelves[0];
                records = shelf.records;
            }
        }
        if (this.state.search !== '') {
            records = this.search(records, this.state.search);
        }
        return (
            <div className="App">
                <div className="shelves-bar-wrapper">
                    <div className={this.state.selectedShelf === -1 ? 'all-shelf-details selected' : 'all-shelf-details' } onClick={() => this.setState({ selectedShelf: -1 })}>
                        <span className="shelf-name">All</span>
                        <span className="shelf-items-count">{this.state.records.length} records</span>
                    </div>
                    <ShelvesBar shelves={this.state.shelves} addShelf={this.addShelf} potentialShelf={this.state.potentialShelf} selectedShelf={this.state.selectedShelf} onShelfSelect={(shelfId) => {
                        this.setState({ selectedShelf: shelfId });
                    }} deleteShelf={(shelfId) => {
                        const shelves = this.state.shelves;
                        const shelfArr = shelves.filter(s => +s.id !== +shelfId);
                        const newState = { shelves: shelfArr };
                        if (+this.state.selectedShelf === +shelfId) {
                            newState.selectedShelf = -1;
                        }
                        this.setState(newState);
                    }}></ShelvesBar>
                </div>
                { this.state.pagesFetched === 0
                    ? <div className="loading-wrapper">
                        <div className="loader">loading</div>
                    </div>
                    : <div className="records-grid-wrapper">
                        <div className="search-bar-wrapper">
                            <label>Search:</label>
                            <input className="form" type="text" value={this.state.search} onChange={(e) => {
                                this.setState({ search: e.currentTarget.value });
                            }}></input>
                        </div>
                        <RecordsGrid dragEnd={this.dragEnd} dragMove={this.dragMove} records={records}></RecordsGrid>
                    </div>
                }
            </div>
        );
    }
}

function pointInRect (location, rect) {
    if (
        (rect.x <= location.x && location.x <= rect.x + rect.width) &&
        (rect.y <= location.y && location.y <= rect.y + rect.height)
    ) {
        return true;
    }
    return false;
}

function shelfIdFromPoint (location) {
    const shelvesDOM = Array.prototype.slice.call(document.querySelectorAll('.shelves-bar-container > ul > li.shelf-item'));

    let shelfDOM;
    for (let i = 0; i < shelvesDOM.length; i++) {
        const s = shelvesDOM[i];
        const rect = s.getBoundingClientRect();
        if (pointInRect(location, rect)) {
            shelfDOM = s;
            break;
        }
    }
    if (shelfDOM) {
        return +shelfDOM.dataset.shelfid;
    }

    return -1;
}

export default App;
