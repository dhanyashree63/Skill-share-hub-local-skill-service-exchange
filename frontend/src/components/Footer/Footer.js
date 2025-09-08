import { Box, Heading, HStack, Stack, VStack } from '@chakra-ui/react';
import React from 'react';
import {
  TiSocialYoutubeCircular,
  TiSocialInstagramCircular,
} from 'react-icons/ti';
import { DiGithub } from 'react-icons/di';
import { TiSocialLinkedinCircular } from "react-icons/ti";

const Footer = () => {
  return (
    <Box padding={'4'} bg="blackAlpha.900" minH={'10vh'}>
      <Stack direction={['column', 'row']}>
        <VStack alignItems={['center', 'flex-start']} width="full">
          <Heading children="All Rights Reserved" color={'white'} />
          <Heading
            fontFamily={'body'}
            size="sm"
            children="Profile 1"
            color={'teal.400'}
          />
        </VStack>

        <HStack
          spacing={['2', '10']}
          justifyContent="center"
          color={'white'}
          fontSize="50"
        >
          <a
            href="https://www.linkedin.com/in/dhanyashree-n-70a27a32b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
            target={'blank'}
            rel="noopener noreferrer"
          >
            <TiSocialLinkedinCircular />
          </a>
          <a
            href="https://www.instagram.com/dhanyashree7777?igsh=MXZwYXptNXo1ZzJzdg=="
            target={'blank'}
            rel="noopener noreferrer"
          >
            <TiSocialInstagramCircular />
          </a>
          <a
            href="https://github.com/dhanyashree63"
            target={'blank'}
            rel="noopener noreferrer"
          >
            <DiGithub />
          </a>
        </HStack>
      </Stack>
    </Box>
  );
};

export default Footer;
