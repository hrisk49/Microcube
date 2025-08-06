import {addressModel} from './address.model';

export  interface  partyModel {
  nM:string; // Name
  // Party or Customer Info
  nm: string;                          // Name, max 140, allowed chars defined externally
  address: addressModel;                   // Address object
  ctryOfRes: string;                  // Country of Residence (2-letter ISO code)

  // Organisation Identification
  orgIdBic: string;                   // BIC (max 12)
  orgIdLei: string;                   // LEI (Legal Entity Identifier, max 20)
  orgIdOthrId: string;                // Other ID (max 35)
  orgIdOthrScNmCd: string;           // Scheme Name Code (max 4)
  orgIdOthrIssr: string;             // Other Issuer (max 35)

  // Private Identification
  birthDt: string;                    // Birth Date (ISO format string)
  prvcOfBirth: string;                // Province of Birth (max 35)
  cityOfBirth: string;                // City of Birth (max 35)
  ctryOfBirth: string;                // Country of Birth (2-letter code)

  prvtOthId1: string;                 // Other Private ID 1 (max 35)
  prvtOthIdSchNmCd1: string;          // Scheme Name Code for ID 1
  prvtOthIdIssr1: string;             // Issuer for ID 1 (max 35)

  prvtOthId2: string;                 // Other Private ID 2 (max 35)
  prvtOthIdSchNmCd2: string;          // Scheme Name Code for ID 2
  prvtOthIdIssr2: string;             // Issuer for ID 2 (max 35)

}
