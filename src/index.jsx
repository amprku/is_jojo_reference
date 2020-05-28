import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col } from 'react-flexbox-grid'
import {useSpring, animated} from 'react-spring'
import { Card, Button, Pagination, InputGroup, FormControl } from 'react-bootstrap';

// on frontend load, determine the given 'scene'
const NUMBER_SCENERIES = 1;
let currentScene = Math.random() << 0;

class PageHeader extends React.Component {
    render() {
        return (
            <Grid>
                <Row center="xs">
                    <h1 className='main-header'> Is this a Jojo Reference? </h1>
                </Row>
                <Row center="xs">
                    <h2 className="sub-header"> It probably is.</h2>
                </Row>
            </Grid>
        );
        }
}

class ResultRow extends React.Component {

    constructor(props){
        super(props)
    }

    render(){
        return (
             <Card>
                {/*<Card.Img variant="top"*/}
                          {/*src={`/static/images/parts/${*/}
                          {/*this.props.d.part*/}
                      {/*}.jpg`} />*/}
                <Card.Body>
                    <blockquote className="blockquote mb-0 card-body">
                      <p>
                          {this.props.d.sentence}
                      </p>
                      <footer className="blockquote-footer">
                        <small className="text-muted">
                            <cite title="Source Title">
                                {this.props.d.character}
                            </cite>
                        </small>
                      </footer>
                    </blockquote>
                </Card.Body>

                <Card.Footer>
                    <small className="text-muted">
                         Season 1 {this.props.d.part} - Episode {this.props.d.episode} - {this.props.d.minutes}:{this.props.d.seconds}
                    </small>
                </Card.Footer>
              </Card>
        );
    }

}

                // {/*<Card.Img variant="top"*/}
                //           {/*src={`/static/images/parts/${*/}
                //           {/*item.part*/}
                //       {/*}.jpg`} />*/}
function renderCard(item){
    return (
        <Col xs={6} md={4} xl={2}>
            <Card className="quote-card">
                 <div className="bg-image bg-image-card" style={{
                              "backgroundImage": `url(/static/images/parts/${item.part}.jpg)`
                          }}>

                 </div>

                <Card.Body className="quote-card-body">
                    <blockquote className="blockquote mb-0 card-body">
                        <p className="sentence-text">"{item.sentence}"</p>
                        {/*<svg  viewBox="0 0 100 100">*/}
                          {/*<foreignObject width="100%" height="100%">*/}
                            {/*<i >""</i>*/}
                          {/*</foreignObject>*/}
                        {/*</svg>*/}


                    <footer className="blockquote-footer">
                        <small className="text-muted ">
                            <cite title="Source Title">
                                {item.character}
                            </cite>
                        </small>
                      </footer>
                    </blockquote>
                </Card.Body>

                <Card.Footer>
                    <small className="text-muted">
                         Part {item.part} - S{item.season}E{item.episode} - {item.minutes}:{item.seconds}
                    </small>
                </Card.Footer>
              </Card>
        </Col>
    );
}

class ResultHeader extends React.Component {
    constructor(props){
        super(props)
    }

    render () {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>
                        Yes, <i>"{this.props.phrase}"</i> is a Jojo Reference
                    </Card.Title>
                    <Card.Subtitle>
                        {
                            this.props.count > 1 ?
                            'This phrase was said ' +
                            this.props.count + ' times.' : null
                        }
                        {
                            this.props.count === 1 ?
                            'This phrase was said 1 time.' : null
                        }
                    </Card.Subtitle>
                    <br/>
                    <Button onClick={this.props.onClear}> Try another phrase </Button>
                </Card.Body>
            </Card>
        )
    }
}

class QuotePagination extends React.Component {

    constructor(props){
        super(props);
        this.items = [];
        this.state = {currentPage : 1};
        this.setCurrentPage = this.setCurrentPage.bind(this);

        this.pages = [];

        for (let number = 1; number <= this.props.count; number++) {
            this.pages.push(number);
        }

        console.log(this.pages)

    }

    setCurrentPage(selectedPage){
        this.setState({currentPage:selectedPage});
        console.log(this.state);
        this.props.onSelect(selectedPage);
    }

    render () {
        return (
            <Pagination size="lg">
                {this.pages.map((number) =>
                    <Pagination.Item
                        onClick={() => {this.setCurrentPage(number)}}
                        active={number === this.state.currentPage}
                    >{number}
                    </Pagination.Item>)
                }
            </Pagination>
        );
    }
}

class QuoteCards extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Grid fluid>
                <Row start="xs">
                    {this.props.result.map(renderCard)}
                </Row>
            </Grid>
        );
    }
}

class QuoteDisplay extends React.Component {

    constructor(props) {
        super(props);


        const cardLimit = 6;
        this.cardsPerPage = this.props.result.length > cardLimit ? cardLimit : this.props.result.length;
        this.pageCount = parseInt(this.props.result.length / this.cardsPerPage);
        this.pageCount = this.pageCount > 10 ? 10 : this.pageCount;

        this.state = {
            page : 1,
            current:this.props.result.slice(0, this.cardsPerPage)
        };
        this.handlePageSelect = this.handlePageSelect.bind(this);
    }

    handlePageSelect(newPage){
        const newStart = (newPage - 1) * this.pageCount;
        this.setState({
            page:newPage,
            current:this.props.result.slice(newStart, newStart + this.cardsPerPage)
        })
    }

    render() {
        return (
            <React.Fragment>
                <QuotePagination count={this.pageCount} onSelect={this.handlePageSelect}/>
                <QuoteCards result={this.state.current}
                            page={this.state.page}/>
            </React.Fragment>
        );
    }
}

// result page
class ResultDisplay extends React.Component {

    constructor(props){
        super(props)
    }

    render () {
        return (
            <React.Fragment>
                <ResultHeader phrase={this.props.phrase}
                              count={this.props.result.length}
                              onClear={this.props.onClear}
                />
                <QuoteDisplay result={this.props.result}/>
                {/*{this.props.result.map(data => <ResultRow d={data}/>)}*/}
            </React.Fragment>

        );
    }
}


// home page
class PhraseEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // user input
            value: '',

            // state and error management
            isLooking:false,
            notFound:false,
            errorMsg:''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        this.setState({
            notFound: false,
            isLooking:true,
            errorMsg:null
        });
        fetch(window.location.href + "/phrase?value=" + this.state.value)
            .then(res => res.json())
            .then(
                (result) => {
                    // api returned error message. set state to error and reset enter state
                    if (result.error.length > 0){
                        this.setState({
                            isLooking: false,
                            notFound: false,
                            errorMsg:result.error
                        });
                    // api returned successfully. set state and pass up to prop handler
                    } else {
                        // if result data is empty, then we shouldn't pass value up
                        if (result.data.length === 0){
                            this.setState({
                                notFound: true,
                                isLooking: false,
                                errorMsg:null
                            });
                        } else {
                            // value found.
                            this.setState({
                                notFound: false,
                                isLooking: false,
                                errorMsg:null
                            });
                            this.props.onResult(this.state.value, result.data);
                        }
                    }

                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log(error);
                    this.setState({errorMsg:error.error});
                }
            );
        event.preventDefault();

    }

    handleKeyDown(event) {
        if (event.key === 'Enter'){
            this.handleSubmit(event)
        }
    }

    render() {
        return (
            <Grid>

                <Row center="xs">
                    <InputGroup className="mb-3">
                        <FormControl
                           placeholder="Enter Phrase Here" value={this.state.value}
                           onChange={this.handleChange}
                           onKeyDown={(e) => {(e.key === 'Enter' ? this.handleSubmit(e) : null)}}
                        />
                        <InputGroup.Append>
                          <Button variant="outline-secondary" onClick={this.handleSubmit} > Submit</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Row>
                <Row>
                    <div style={{color:'red'}}>{this.state.errorMsg ? this.state.errorMsg : null}</div>
                    <div style={{color:'red'}}>{this.state.notFound ? 'Phrase was not found.' : null}</div>
                    {this.state.isLooking ? 'Searching for phrases....' : null }
                </Row>
            </Grid>
        );
    }
}

class App extends React.Component {

    constructor(props){
        super(props);
        this.handleResult = this.handleResult.bind(this);
        this.clearResult = this.clearResult.bind(this);
        this.state = {
            'phrase':'',
            'result': []
        };
    }

    handleResult(phrase, result) {
        this.setState({
            'phrase':phrase,
            'result':result
        })
    }

    clearResult() {
        this.setState({
            'phrase':'',
            'result':[]
        })
    }

    render() {
        return (
            <div>
                {this.state.result.length === 0 ?
                    <div className="center">
                        <PageHeader/>
                        <PhraseEntry onResult={this.handleResult}/>
                    </div>
                    :
                    <div>
                        <ResultDisplay phrase={this.state.phrase} result={this.state.result} onClear={this.clearResult}/>
                    </div>
                }
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
