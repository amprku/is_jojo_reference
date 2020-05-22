import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col } from 'react-flexbox-grid'
import styles from '../static/styles.module.css'

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
            <Grid className="result-box">
                <Row end="xs">
                    <Col>
                        {this.props.d.character} in part {this.props.d.part} episode {this.props.d.episode} {this.props.d.minutes}:{this.props.d.seconds}
                    </Col>
                </Row>
                <Row>
                    {this.props.d.sentence}
                </Row>
            </Grid>
        );
    }

}

class ResultDisplay extends React.Component {

    constructor(props){
        super(props)
    }

    render () {
        return (
            <Grid >
                <Row>
                    <button onClick={this.props.onClear}>Try a different phrase.</button>
                    {this.props.result.length > 1 ? 'This phrase was said ' + this.props.result.length + ' times.' : null}
                    {this.props.result.length === 1 ? 'This phrase was said 1 time.' : null}
                </Row>
                <Row>
                    {this.props.result.map(data => <ResultRow d={data}/>)}
                </Row>
            </Grid>

        );
    }
}

class PhraseEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // user input
            value: '',

            // state and error management
            didEnter: false,
            isLooking:false,
            errorMsg:''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        if (this.state.value.length >= 3){
            this.setState({isLooking:true, errorMsg:null});
            fetch("http://localhost:3000/phrase?value=" + this.state.value)
                .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({
                            didEnter: true,
                            isLooking: false,
                            errorMsg:null
                        });

                        this.props.onResult(result);
                    },
                    // Note: it's important to handle errors here
                    // instead of a catch() block so that we don't swallow
                    // exceptions from actual bugs in components.
                    (error) => {
                        console.log(error)
                    }
                );
            event.preventDefault();
        } else {
            this.setState({errorMsg:'Please use a phrase longer than 2 characters.', didEnter:false})
        }
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
                    <input type="text"
                           placeholder="Enter Phrase Here" value={this.state.value}
                           onChange={this.handleChange}
                           onKeyDown={(e) => {(e.key === 'Enter' ? this.handleSubmit(e) : null)}}
                    />
                    <button onClick={this.handleSubmit}> Submit </button>
                </Row>
                <Row>
                    <div style={{color:'red'}}>{this.state.errorMsg ? this.state.errorMsg : null}</div>
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
        this.state = {'result': []};
    }

    handleResult(result) {
        this.setState({'result':result})
    }

    clearResult() {
        this.setState({'result':[]})
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
                        <ResultDisplay result={this.state.result} onClear={this.clearResult}/>
                    </div>
                }
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
