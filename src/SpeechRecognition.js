
export default class SpeechRecognition{
  constructor(options = {}, ...args){
    const {
      continuous = false,
      interimResults = true,
      lang = 'cmn-Hant-TW',
    } = options;
    
    this.inst = new webkitSpeechRecognition(...args); // eslint-disable-line no-undef
    this.inst.continuous = continuous;
    this.inst.interimResults = interimResults;
    this.inst.lang = lang;

    // ============
    this.listening = false;
    // ============

    this.cancelToken = null;
    
  }

  cancel(error){
    if(this.cancelToken){
      this.cancelToken(error);
    }
    this.cancelToken = null;
  }

  start({callbacks} = {}){
    return new Promise((resolve, reject) => {
      let result = null;
      let error = null;

      this.cancelToken = (e) => {
        error = e;
      };

      this.inst.start();
      this.inst.onstart = () => {
        this.listening = true;
        console.log('Listening.');
      };

      this.inst.onend = () => {
        this.listening = false;
        console.log('Stop listening.');

        if(error){
          console.log('error :', error);
          return reject(error);
        }
        if(!result) {
          this.start({callbacks})
          .then(res => {
            resolve(res);
          })
          .catch(e => {
            reject(e);
          });
        } else {
          resolve(result);
        }
      };
      
      this.inst.onresult = (event) => {
        let i = event.resultIndex;
        if(event.results[i].isFinal) {
          result = event.results[i][0].transcript
        }
      };
      
      this.inst.onerror = (event) => {
        error = event;
      };
    });
  }

  stop(){
    this.inst.stop();
    this.cancel({error: 'user-interrupt'});
  }
}

