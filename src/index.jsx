import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col } from 'react-flexbox-grid'
import styles from '../static/styles.module.css'

class PageHeader extends React.Component {
    render() {
        return (
            <Grid>
                <Row center="xs">
                    <h1 className={styles.mainheader}> Is it a Jojo Reference? </h1>
                </Row>
                <Row center="xs">
                    <h2 className={styles["sub-header"]}> Everything is supposed to be... so why don't we get some proof?</h2>
                </Row>
            </Grid>
        );
        }
}

class ResultEntity extends React.Component {

    constructor(props){
        super(props)
    }

    render () {
        return (
            <Grid>
                {this.props.result.map(
                        data =>
                            <Row>
                                <Col>
                                    part {data.part} episode {data.episode}
                                </Col>
                                <Col>
                                    {data.character}
                                </Col>
                                <Col>
                                    {data.minutes}:{data.seconds}
                                </Col>
                                <Col>
                                    {data.sentence}
                                </Col>
                            </Row>
                )}
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
            // input result
            result:[],

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
            this.setState({isLooking:true, result:[]});
            fetch("http://localhost:3000/phrase?value=" + this.state.value)
                .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({
                            result: result,
                            didEnter: true,
                            isLooking: false,
                            errorMsg:null
                        });
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
            this.setState({errorMsg:'Please use a phrase longer than 2 characters.', result:[], didEnter:false})
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


                {this.state.didEnter ? 'This phrase was said ' + this.state.result.length + ' times.' : null}

                <ResultEntity result={this.state.result}/>

            </Grid>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <div>
                <PageHeader/>
                <PhraseEntry/>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
