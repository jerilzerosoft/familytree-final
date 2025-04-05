export interface Person {
    id: number;
    name: string;
    phone: string;
    email: string;
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