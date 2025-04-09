import { StaticImageData } from 'next/image';

export interface Person {
    id: string;
    name: string;
    phone: string;
    email: string;
    avatar: string; 
    address:string
    country?: string; 
    place_of_birth:string;
    date_of_birth:string;
    mothers_name:string;
    fathers_name:string;
    pin_code:string;
    race:string;
    nationality:string;
    username:string;
    user_id:string;
    additional_info:string;
    work_address:string;
    employment:string;
    occupation:string;
    career:string;
    nation:string;
    mykad_number:string;
    telephone:string;
 
}
export interface Persons {
  name: string;
  email: string;
  avatar?: string;
  
}

export interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    person: Persons | null;
}

export interface ImagePreviewProps {
  imageSrc: string;
}

export interface PersonalInfo {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    telephoneNumber: string;
    email: string;
    avatar: string;
}

export interface AddressInfo {
    address: string;
    country: string;
    pinCode: string;
    fathersName: string;
    mothersName: string;
    dateOfBirth: string;
    birthPlace: string;
}

export interface ProfessionalInfo {
    nation: string;
    career: string;
    employment: string;
    workAddress: string;
    additionalInfo: string;
}

export interface UserData {
    personalInfo: PersonalInfo;
    addressInfo: AddressInfo;
    professionalInfo: ProfessionalInfo;
    agreeToTerms: boolean;
}

export interface ApiFeature {
    id: number;
    title: string;
    description: string;
    icon?: string;
    }

    
export interface ApiGalleryFeature {
        id: number;
        title: string;
        description: string;
        icon?: string;
        }

export interface GalleryFeature {
        id: number;
        title: string;
        description: string;
        icon: string | StaticImageData;
        }


