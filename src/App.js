import React, { Component } from 'react';
import SpeechRecognition from './SpeechRecognition';

const recognitionService = new SpeechRecognition();

class App extends Component {
  constructor(){
    super();
    this.state={
      result:'',
    }
  }
  startService = () => {
    return recognitionService.start().then(
      result=>{
        console.log('result',result);
        this.setState({result});
        return result;
      }
    ).catch(e=>{
      console.log('e',e);
      if(e.error === 'no-speech'){
        return this.voiceService();
      }else if(e.error === 'user-interrupt'){
        return ;
      }
      throw e;
    })
  }
  stopService = () => {
    recognitionService.stop();
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Voice Demo</h1>
        </header>
        <p className="App-intro">
          Voice Recognition Result : {this.state.result}
        </p>
        <button onClick={this.startService}>
          Voice Start
        </button>
        <button onClick={this.stopService}>
          Stop Recognition
        </button>
      </div>
    );
  }
}

export default App;
