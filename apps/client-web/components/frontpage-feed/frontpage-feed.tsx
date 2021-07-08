import {PostCard, PostCardProps} from '../post-card/post-card';

import React from 'react';

const examplePostColllection: PostCardProps[] = [
  {
    title: 'Mane Bitch',
    avatarSrc:
      'https://ipfs.io/ipfs/QmacXWQ4dQUppVMiGj6Gt6VyUjrVzF3suyRkSJNpB5VEfm',
    handle: 'Lio',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Adipiscing neque et sed feugiat.',
  },
  {
    title: 'drossum',
    avatarSrc:
      'https://ipfs.io/ipfs/QmVyaUbKTqny6XpinQSmoD9Ez5a2n4RbqbPzgPciVvM9rx',
    handle: 'Kai',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Adipiscing neque et sed feugiat.',
  },
  {
    title: 'kitty cat',
    avatarSrc:
      'https://ipfs.io/ipfs/QmNYeEqxwGD2WeQYFdnXFiusoVZU9oRWoVNTe1LVTYTodj',
    handle: 'Moss',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Adipiscing neque et sed feugiat.',
  },
  {
    title: 'Entail System Messages',
    avatarSrc:
      'https://ipfs.io/ipfs/QmZ5Zj9YjXmN5MLUMVWRcBWGaniw3fcwnUUzi5BQEKVjwJ',
    handle: 'Entail',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Adipiscing neque et sed feugiat.',
  },
];

/** A queue of post card components. */
export function FrontPageFeed() {
  const [posts] = React.useState<PostCardProps[]>(examplePostColllection);

  return (
    <div className="flex flex-col items-center max-w-md">
      {posts.map((post, index) => (
        <PostCard
          key={index}
          className={index % 2 === 0 ? 'self-start' : 'self-end'}
          {...post}
        />
      ))}
    </div>
  );
}

export default FrontPageFeed;
