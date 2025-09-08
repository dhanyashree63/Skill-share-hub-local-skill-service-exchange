import {
  Avatar,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { RiSecurePaymentFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import introVideo from '../../assets/videos/intro.mp4';
import termsAndCondition from '../../assets/docs/termsAndCondition';
import profile1 from "../../assets/images/profile1.jpeg";
import profile2 from "../../assets/images/profile2.jpeg";

const FounderCard = ({ src, name, title, bio }) => (
  <VStack>
    <Avatar src={src} boxSize={['40', '48']} />
    <Text children={title} opacity={0.7} />
    <Heading size={['sm', 'md']} children={name} mt="2" />
    {bio && (
      <Text textAlign={'center'} maxW="xs" fontSize={['sm', 'md']} mt="2">
        {bio}
      </Text>
    )}
  </VStack>
);

const Founders = () => (
  <Stack
    direction={['column', 'row']}
    spacing={['8', '16']}
    padding={'8'}
    alignItems="center"
    justifyContent="center"
  >
    <FounderCard
      src={profile1}
      name="Alex Sharma"
      title="Co-Founder"
      bio="Alex leads product and engineering. Passionate about building learning experiences."
    />
    <FounderCard
      src={profile2}
      name="Priya Verma"
      title="Co-Founder"
      bio="Priya heads content and partnerships. She curates quality courses for all learners."
    />
  </Stack>
);

const VideoPlayer = () => (
  <Box my="6" width={'100%'}>
    <video
      style={{ width: '100%', borderRadius: 8 }}
      autoPlay
      loop
      muted
      controls
      controlsList="nodownload nofullscreen noremoteplayback"
      disablePictureInPicture
      disableRemotePlayback
      src={introVideo}
    />
  </Box>
);

const TandC = ({ termsAndCondition }) => (
  <Box>
    <Heading
      size={'md'}
      children="Terms & Conditions"
      textAlign={['center', 'left']}
      my="4"
    />

    <Box h="sm" p="4" overflowY={'auto'} borderRadius="md" bg="gray.50">
      <Text
        fontFamily={'heading'}
        letterSpacing={'wide'}
        textAlign={['center', 'left']}
        color="gray.700"
        whiteSpace="pre-wrap"
      >
        {termsAndCondition}
      </Text>
      <Heading
        my="4"
        size={'xs'}
        children="Refunds: See our refund policy for details."
      />
    </Box>
  </Box>
);

const About = () => {
  return (
    <Container maxW={'container.lg'} padding="16" boxShadow={'lg'} bg="white" borderRadius="md">
      <Heading children="About Us" textAlign={['center', 'left']} mb="6" />
      <Founders />

      <Stack m="8" direction={['column', 'row']} alignItems="center" justifyContent="space-between">
        <Text fontFamily={'cursive'} m="8" textAlign={['center', 'left']} flex="1">
          Skill Share Hub is an online learning platform offering a mix of free and premium courses created by industry experts — designed to help learners upskill and grow.
        </Text>

        <Link to="/subscribe">
          <Button variant={'solid'} colorScheme="purple">
            Explore Plans
          </Button>
        </Link>
      </Stack>

      <VideoPlayer />

      <TandC termsAndCondition={termsAndCondition} />

      <HStack my="4" p={'4'} spacing="4" alignItems="center">
        <RiSecurePaymentFill size="20" />
        <Heading
          size={'xs'}
          fontFamily="sans-serif"
          textTransform={'uppercase'}
          children={'Payment is secured by Razorpay'}
        />
      </HStack>
    </Container>
  );
};

export default About;
