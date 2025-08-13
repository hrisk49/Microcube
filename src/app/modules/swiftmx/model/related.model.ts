import {agentModel} from './agent.model';
export  interface  relatedModel {
    charSet: string;                 // CharacterSet
    fr: agentModel;                       // From Agent (OriginalEndToEndIdentification)
    to: agentModel;                       // To Agent (OriginalEndToEndIdentification)
    bizMsgIdr: string;              // BusinessMessageIdentifier (max 35)
    msgDefIdr: string;              // MessageDefinitionIdentifier (e.g., PACS.009.01.08)
    bizSvc: string;                 // BusinessService (max 35)
    creDt: string;                  // CreationDate (ISO format recommended)
    cpyDplct: 'CODU' | 'COPY' | 'DUPL'; // CopyDuplicate values
    prty: 'HIGH' | 'NORM';          // Priority values (if known constraints apply)
  }
