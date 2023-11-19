import Link from 'next/link';

import { Button, ButtonGroup } from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import BookToday from './BookToday';
import { Box } from '@mui/material';

import styles from './HeroSection.module.css';

export default function HeroSection(props) {
  return (
    <Box className={styles.container} sx={{ objectFit: 'contain' }}>
      <BookToday book={props.bookToday} />
      <div className={styles.infoWrapper}>
        <h1 className={styles.titleInfo}>Find Your Favorite Books Nearby</h1>

        <p className={styles.description}>
          Dive into a sea of accessible education with BookHarbor – your
          community-driven haven for sharing, buying, and borrowing textbooks
          and course materials. We set sail to overcome the challenges faced by
          students, educators, and book enthusiasts, providing an affordable and
          sustainable solution.
        </p>

        <div className={styles.button}>
          <ButtonGroup variant="contained" size="large">
            <Button href="/books">Looking for books nearby?</Button>
            <Button href="/books">
              <ArrowOutwardIcon />
            </Button>
          </ButtonGroup>
        </div>

        <p className={styles.description2}>
          Join us in building a community where educational importance meets
          affordability, sustainability, and the joy of discovering new reads.
          &nbsp;
          <span style={{ fontWeight: '200' }}>
            BookHarbor – Anchoring Knowledge, Sailing Together
          </span>
        </p>
      </div>
    </Box>
  );
}
