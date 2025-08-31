import {AgentModel} from './agent.model';
import {RelatedModel} from './related.model';
import {AccountModel} from './account.model';
import {Party} from './mx003.model';


export interface Mx004Model {
     bizMsgIdr :String;//BusinessMessageIdentifier max 35
     msgDefIdr  :String;//MessageDefinitionIdentifier example - camt.001.001.03
     bizSvc  :String;//BusinessService The value "swift.cbprplus.02" must be used.
     creDt :String;
     reqdColltnDt :String;//RequestedCollectionDate Mandatory

     cpyDplct :String; // values can be only - CODU,COPY,DUPL
     psblDplct :String; //PossibleDuplicate Values Can only  be - YES/NO
     priority :String;// Header block Priority values can only be - HIGH,NORM
     msgId :String; // MessageIdentification  //0-9 a-z A-Z / - ? : ( ) . , ' +
     creDtTm :String;//CreationDateTime
     nbOfTxs :String;// Number of transactions
     sttlmMtd :String;//SettlementMethod value - COVE,INDA,INGA
     sttlmAcct :AccountModel;//SettlementMethod
  /// PaymentIdentification Tag
  /// Assigned by Instructing party to Instructed party to identify the msg uniquely
  /// can never have starting or ending / and never have '//'
     instrId  :String;//InstructionIdentification Max 16 pattern 0-9 a-z A-Z - ? : ( ) . , ' +
     endToEndId  :String;//EndToEndIdentification max 35
     txId  :String;//TransactionIdentification max 35 Mandatory
  /// If the pacs.009 is used to settle a pacs.009 Advice, the UETR should transport
  /// the UETR of the underlying pacs.009 Advice
     UETR  :String;//Mandatory

  //End PaymentIdentification tag

  //**Start PaymentTypeInformation
     InstrPrty  :String;//InstructionPriority value can be HIGH/NORM
     ClrChanl  :String;//ClearingChannel values can be BOOK/MPNS/RTGS/RTNS
     SvcLvlCD  :String;//=new String[3];
     SvcLvlPrtry  :String;//=new String[3];//Proprietary
     LclInstrmCD  :String;//LocalInstrument
     LclInstrmPrtry  :String;//LocalInstrument Proprietary
     CtgyPurpCd  :String;//CategoryPurpose Code
     CtgyPurpPrtry  :String;//CategoryPurpose
  //**End PaymentTypeInformation**

     IntrBkSttlmAmtCcy  :String;//InterbankSettlementAmount max 3 char
     IntrBkSttlmAmt  :String;// long   //InterbankSettlementAmount size 14,5
     IntrBkSttlmDt   :String;//InterbankSettlementDate

     PrvsInstgAgt1 :AgentModel;//PreviousInstructingAgent1 <>
     PrvsInstgAgt1Acct : AccountModel;//PreviousInstructingAgent1Account <>
     PrvsInstgAgt3 :AgentModel;//PreviousInstructingAgent3 <>
     PrvsInstgAgt2 : AgentModel;//PreviousInstructingAgent2 <>
     PrvsInstgAgt2Acct : AccountModel;//PreviousInstructingAgent2Account <>
     PrvsInstgAgt3Acct: AccountModel;//PreviousInstructingAgent3Account <>

  //** Original Group Header Block
     GrpHdrmsgId:String;//Add Habib
     GrpHdrNbOfTxs:String;//Add Habib

  //** Original Group Header Block


     TxSts  :String;//TransactionStatus ExternalPaymentTransactionStatus1Code
  /// Return Reason Information block RtrRsnInf
     Orgtr  :Party;//Originator
     RsnCd  :String;//Reason CODE RtrRsnInf
     RsnPrtry  :String;//Reason Proprietary
     AddtlInf1  :String;//AdditionalInformation 105 [0-9a-zA-Z/\-\?:\(\)\.,'\+ ]
     AddtlInf2  :String;//AdditionalInformation 105
  /// END
     FctvIntrBkSttlmDt  :String;//EffectiveInterbankSettlementDate
     Rltd:RelatedModel;//InstructedAgent

     PurpCD  :String;//Purpose ExternalPurpose1Code max 4
     PurpPrtry  :String;//Purpose ExternalPurpose1Code max 35
     RmtInf  :String;//RemittanceInformation Max140 [0-9a-zA-Z/\-\?:\(\)\.,'\+ !#$%&\*=^_`\{\|\}~";<>@\[\\\]]+
     auth1stBy :String;
     makeDt  :String;
     auth1stDt  :String;
     auth2ndBy  :String;
     auth2ndDt  :String;
     lastAction  :String;
     branchId  :String;
     trnRefNo20  :String;
     relatedRef21  :String;


     //Payment Return V09 -> Transaction Information
      OrgnlMsgId  :String;//OriginalMessageIdentification Mandatory 35 [0-9a-zA-Z/\-\?:\(\)\.,'\+ ]+
      OrgnlMsgNmId  :String;//OriginalMessageNameIdentification Mandatory for example, pacs.003.001.01 or MT103.[0-9a-zA-Z/\-\?:\(\)\.,'\+ ]+
      OrgnlCreDtTm  :String;//OriginalCreationDateTime Mandatory
      OrgnlInstrId  :String;//OriginalInstructionIdentification 16
      OrgnlEndToEndId  :String;//OriginalEndToEndIdentification Mandatory
      OrgnlTxId  :String;//OriginalTransactionIdentification 35
      OrgnlUETR  :String;//OriginalUETR Mandatory 35  (UUID)
      OrgnlClrSysRef:String;
      OrgnlIntrBkSttlmAmt:String;
      OrgnlIntrBkSttlmDt:String;
      RtrdIntrBkSttlmAmt:String;
      SttlmPrty  :String;//SettlementPriority valus HIGH/NORM/URGT
      RtrdInstdAmt:String;
      XchgRate:String;
      ChrgBr  :String;//ChargeBearer Mandatory values CRED/DEBT/SHAR/SLEV
      ClrSysRef  :String; //ClearingSystemReference max 35 pattern [0-9a-zA-Z/\-\?:\(\)\.,'\+ ]+

      // Settlement Time Indication
      DbtDtTm:String;
      CdtDtTm:String;

      //Payment Return V09 -> Transaction Information->Original Group Information -> Charges Information
      ChgAmt  :String;
      //Payment Return V09 -> Transaction Information->Original Group Information -> Charges Information -> Agent
      ChrgsInfAgnt:AgentModel; //InstructedAgent
      ChgCcy  :String;
     //Payment Return V09 -> Transaction Information->Charges Information -> Instructing Agent
      InstgAgt:AgentModel;//InstructingAgent <>
     //Payment Return V09 -> Transaction Information->Charges Information -> Instructed Agent
      InstdAgt :AgentModel;//InstructedAgent <>
}
