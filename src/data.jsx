import teamMemeber1 from './assets/images/Team-members/team-member-1.jpg';
import teamMemeber2 from './assets/images/Team-members/team-member-2.jpg';
import teamMemeber3 from './assets/images/Team-members/team-member-3.jpg';
import teamMemeber4 from './assets/images/Team-members/team-member-4.jpg';
import googleLogo from './assets/images/socials/google.png';
import githubLogo from './assets/images/socials/github.png';
import {
  ReceiveSquare,
  User,
  Music,
  MusicSquareSearch,
  Sms,
  Call,
  Location,
} from 'iconsax-reactjs';

export const usageChartData = [
  { month: 'Jan', music: 10, musicVideo: 15, webBrowsing: 13 },
  { month: 'Feb', music: 13, musicVideo: 17, webBrowsing: 7 },
  { month: 'Mar', music: 15, musicVideo: 13, webBrowsing: 16 },
  { month: 'Apr', music: 17, musicVideo: 19, webBrowsing: 22 },
  { month: 'May', music: 12, musicVideo: 24, webBrowsing: 19 },
  { month: 'Jun', music: 19, musicVideo: 34, webBrowsing: 14 },
  { month: 'Jul', music: 26, musicVideo: 30, webBrowsing: 20 },
  { month: 'Aug', music: 31, musicVideo: 38, webBrowsing: 24 },
  { month: 'Sep', music: 36, musicVideo: 40, webBrowsing: 30 },
  { month: 'Oct', music: 30, musicVideo: 35, webBrowsing: 21 },
  { month: 'Nov', music: 39, musicVideo: 30, webBrowsing: 35 },
  { month: 'Dec', music: 45, musicVideo: 27, webBrowsing: 42 },
];

export const teamMembers = [
  { id: 1, name: 'Ada Wong', profilePic: teamMemeber1, memberId: '@ada_wong' },
  { id: 2, name: 'Leon Kennedy', profilePic: teamMemeber2, memberId: '@scottkennedy' },
  { id: 3, name: 'Chris Redfield', profilePic: teamMemeber3, memberId: '@chris_redfield11' },
  { id: 4, name: 'Jill Valentine', profilePic: teamMemeber4, memberId: '@valentine_jill' },
];

export const faqQuestions = [
  {
    id: 1,
    icon: <ReceiveSquare />,
    question: 'Is music download free?',
    answer:
      'We offer both free and premium downloads. Some tracks can be downloaded for free, while others require a subscription for access',
  },
  {
    id: 2,
    icon: <User />,
    question: 'How do I sign up?',
    answer:
      'You can sign up by clicking the "Sign Up" button on the homepage. Simply fill in your details or use a social media account to register quickly.',
  },
  {
    id: 3,
    icon: <Music />,
    question: 'Can I listen offline?',
    answer:
      'Yes, you can download tracks with our premium subscription and enjoy them offline whenever you want.',
  },
  {
    id: 4,
    icon: <MusicSquareSearch />,
    question: 'What genres are available?',
    answer:
      'VioTune features a wide range of genres, including pop, rock, jazz, classical, and electronic. Explore the library to discover your favorites.',
  },
  {
    id: 5,
    icon: <Music />,
    question: 'Can I listen offline?',
    answer:
      'Yes, you can download tracks with our premium subscription and enjoy them offline whenever you want.',
  },
  {
    id: 6,
    icon: <ReceiveSquare />,
    question: 'Is music download free?',
    answer:
      'We offer both free and premium downloads. Some tracks can be downloaded for free, while others require a subscription for access',
  },
];

export const contactInfos = [
  {
    id: 1,
    icon: <Sms />,
    title: 'Email',
    description: 'Our friendly team is here to help.',
    contactInfo: 'Zamani.nima18@gmail.com',
  },
  {
    id: 2,
    icon: <Call />,
    title: 'Phone',
    description: 'Our friendly team is here to help.',
    contactInfo: '+1 (555) 000-0000',
  },
  {
    id: 3,
    icon: <Location />,
    title: 'Office',
    description: 'Our friendly team is here to help.',
    contactInfo: '100 Smith Street',
  },
];

export const socialSignUpButtons = [
  { id: 1, imageSrc: googleLogo, provider: 'google' },
  { id: 2, imageSrc: githubLogo, provider: 'github' },
];
