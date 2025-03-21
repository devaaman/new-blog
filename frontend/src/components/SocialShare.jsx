import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  RedditShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  PinterestIcon,
  RedditIcon,
} from 'react-share';

const SocialShare = ({ url, title, image, description }) => {
  return (
    <div className="flex flex-col space-y-3 bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-gray-700 font-medium text-center pb-2 border-b border-gray-200">Share this post</h3>
      <div className="flex flex-wrap gap-2 justify-center">
        <FacebookShareButton url={url} quote={title}>
          <FacebookIcon size={40} round={true} />
        </FacebookShareButton>
        
        <TwitterShareButton url={url} title={title}>
          <TwitterIcon size={40} round={true} />
        </TwitterShareButton>
        
        <WhatsappShareButton url={url} title={title}>
          <WhatsappIcon size={40} round={true} />
        </WhatsappShareButton>
        
        <LinkedinShareButton url={url} title={title} summary={description}>
          <LinkedinIcon size={40} round={true} />
        </LinkedinShareButton>
        
        <PinterestShareButton url={url} media={image} description={title}>
          <PinterestIcon size={40} round={true} />
        </PinterestShareButton>
        
        <RedditShareButton url={url} title={title}>
          <RedditIcon size={40} round={true} />
        </RedditShareButton>
      </div>
    </div>
  );
};

export default SocialShare;