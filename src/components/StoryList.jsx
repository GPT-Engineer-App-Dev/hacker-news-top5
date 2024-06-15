import React, { useState, useEffect } from 'react';
import { Box, Text, Link, VStack, Input, useColorMode, IconButton } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

const StoryList = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then(response => response.json())
      .then(data => {
        const top5Ids = data.slice(0, 5);
        return Promise.all(top5Ids.map(id => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())));
      })
      .then(stories => {
        setStories(stories);
        setFilteredStories(stories);
      })
      .catch(error => console.error('Error fetching stories:', error));
  }, []);

  useEffect(() => {
    setFilteredStories(
      stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, stories]);

  return (
    <Box p={4} maxW="container.md" mx="auto">
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Input
          placeholder="Search stories..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <IconButton
          aria-label="Toggle dark mode"
          icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
          onClick={toggleColorMode}
        />
      </Box>
      <VStack spacing={4} overflowY="auto" maxH="70vh">
        {filteredStories.map(story => (
          <Box key={story.id} p={4} borderWidth="1px" borderRadius="md" w="100%">
            <Text fontSize="xl" fontWeight="bold">
              {story.title}
            </Text>
            <Link href={story.url} color="teal.500" isExternal>
              Read more
            </Link>
            <Text>Upvotes: {story.score}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default StoryList;