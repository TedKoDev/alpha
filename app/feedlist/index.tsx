import ListLayout from '~/components/layouts/ListLayout';

const feedData = [
  {
    id: '1',
    author: '커직이',
    title: '지금 숙대 앞에서 열리는 베스트 브레드 여행! 5선!',
    content: '여행은 사람을 설레게 죽이는 시사회며...',
    datetime: new Date().toISOString(),
    image: null,
    views: 23,
    comments: 9,
    likes: 32,
  },
];

export default function FeedList() {
  return <ListLayout headerTitle="커뮤니티" data={feedData} showViewToggle />;
}
