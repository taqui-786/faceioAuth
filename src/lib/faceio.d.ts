declare module '@faceio/fiojs'{ 
class faceIO {
    constructor(apiKey: string)
    enroll(options: any): Promise<any>;
    authenticate():any
    fetchAllErrorCodes():any
    restartSession():any
  }

  export = faceIO;
}