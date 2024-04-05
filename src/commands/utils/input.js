const isValidLink = (input) => {
  const urlRegex = /^(?:https?:\/\/)?(?:\w+\.)+\w{2,}(?:\/\S*)?$/;
  return urlRegex.test(input);
}

const isValidYouTubeLink = (input) => {
  const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|embed)\/|watch\?(?:.*&)?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  return youtubeRegex.test(input);
}

const validateInput = (input) => {
  let error;
  let isLink;
  let isSearch;

  if (isValidLink(input)) {
    if (isValidYouTubeLink(input)) {
      isLink = true
    } else {
      error = "Not a valid YouTube link";
    }
  } else {
    isSearch = true
  }

  return {
    error,
    isLink,
    isSearch
  }
}

module.exports = {
  isValidLink,
  isValidYouTubeLink,
  validateInput
}
