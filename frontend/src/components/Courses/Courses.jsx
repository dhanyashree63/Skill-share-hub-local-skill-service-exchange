import {
  Button,
  Container,
  Heading,
  HStack,
  Image,
  Input,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  AspectRatio,
  Badge,
  Box,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "../../redux/actions/course";
import toast from "react-hot-toast";
import { addToPlaylist } from "../../redux/actions/profile";
import { myProfile } from "../../redux/actions/user";

// --- Category-based poster helper ---
const categoryPosterMap = {
  "Web development": "/static/posters/webdev.jpg",
  "Artificial Intelligence": "/static/posters/ai.jpg",
  "Data Structure & Algorithm": "/static/posters/dsa.jpg",
  "App Development": "/static/posters/appdev.jpg",
  // add more mappings if you have more categories
};

function getPosterForCourse(course) {
  // 1) prefer the DB poster (Cloudinary/picsum) if present
  if (course?.poster?.url) return course.poster.url;

  // 2) category-based local poster (if we have a mapping)
  if (course?.category && categoryPosterMap[course.category]) {
    return categoryPosterMap[course.category];
  }

  // 3) fallback default poster
  return "/static/posters/default.jpg";
}
// --- end helper ---


const CourseCard = ({
  course,
  addToPlaylistHandler,
  loading,
}) => {
  const navigate = useNavigate();

  const poster = getPosterForCourse(course);

  const onWatch = () => {
    // If course.isFree -> go to watch page; else go to checkout (you can change routes)
    if (course?.isFree) {
      navigate(`/course/${course._id}/watch`);
    } else {
      navigate(`/course/${course._id}/checkout`);
    }
  };

  return (
    <VStack
      spacing={3}
      alignItems="stretch"
      bg="white"
      borderRadius="md"
      overflow="hidden"
      shadow="sm"
      _hover={{ transform: "translateY(-6px)", shadow: "md" }}
      transition="all 0.15s"
    >
      <Box position="relative" bg="gray.100">
        <AspectRatio ratio={16 / 9}>
          <Image
            src={poster}
            alt={course?.title || "Course poster"}
            objectFit="cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/static/fallback.jpg";
            }}
          />
        </AspectRatio>

        <Badge
          position="absolute"
          top="8px"
          left="8px"
          px={3}
          py={1}
          borderRadius="md"
          fontWeight="bold"
          colorScheme={course?.isFree ? "green" : "purple"}
        >
          {course?.isFree ? "FREE" : course?.price ? `₹${course.price}` : "PAID"}
        </Badge>
      </Box>

      <Box px={4} pb={4} pt={3}>
        <Heading size="sm" mb={2} noOfLines={2}>
          {course?.title}
        </Heading>

        <Text color="gray.600" fontSize="sm" noOfLines={2} mb={3}>
          {course?.description}
        </Text>

        <HStack justifyContent="space-between" mb={3}>
          <Text fontSize="xs" color="gray.500">
            {course?.createdBy || "Admin"}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {course?.numOfVideos || 0} lectures • {course?.views || 0} views
          </Text>
        </HStack>

        <Stack direction="row" spacing={3}>
          <Button colorScheme="teal" size="sm" onClick={onWatch}>
            {course?.isFree ? "Watch Free" : "Watch Now"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            colorScheme="teal"
            isLoading={loading}
            onClick={() => addToPlaylistHandler(course._id)}
          >
            Add to playlist
          </Button>

          <Link to={`/courses/${course._id}`} style={{ marginLeft: "auto" }}>
            <Button size="sm" variant="ghost">
              Details
            </Button>
          </Link>
        </Stack>
      </Box>
    </VStack>
  );
};

const Courses = () => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const dispatch = useDispatch();

  const addToPlaylistHandler = async (courseId) => {
    await dispatch(addToPlaylist(courseId));
    dispatch(myProfile());
  };

  // corrected category string
  const categories = [
    "Web development",
    "Artificial Intelligence",
    "Data Structure & Algorithm",
    "App Development",
    "Data Science",
    "Game Development",
  ];

  // IMPORTANT: getAllCourses expects (keyword, category) — fixed order
  const { loading, courses, error, message } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(getAllCourses(keyword, category));
  }, [dispatch, keyword, category]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearError" });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [error, message, dispatch]);

  return (
    <Container minH="95vh" maxW="container.xl" py={8}>
      <Heading mb={6}>All Courses</Heading>

      <Input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search a course..."
        type="text"
        focusBorderColor="teal.500"
        mb={4}
      />

      <HStack
        overflowX="auto"
        py={4}
        spacing={3}
        css={{
          "&::-webkit-scrollbar": { display: "none" },
        }}
        mb={6}
      >
        {categories.map((item, idx) => (
          <Button
            key={idx}
            onClick={() => setCategory(item)}
            minW="120px"
            bg={category === item ? "teal.400" : "gray.200"}
            color={category === item ? "white" : "gray.800"}
            _hover={{ opacity: 0.9 }}
            size="sm"
            borderRadius="md"
          >
            <Text fontSize="sm">{item}</Text>
          </Button>
        ))}

        {/* clear filter button */}
        <Button
          onClick={() => setCategory("")}
          size="sm"
          variant={category === "" ? "solid" : "ghost"}
        >
          All
        </Button>
      </HStack>

      {courses && courses.length > 0 ? (
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {courses.map((item) => (
            <CourseCard
              key={item._id}
              course={item}
              addToPlaylistHandler={addToPlaylistHandler}
              loading={loading}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Heading mt={8} textAlign="center" size="md">
          Courses Not Found
        </Heading>
      )}
    </Container>
  );
};

export default Courses;
