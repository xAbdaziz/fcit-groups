import { Title, Text, Button, Container } from '@mantine/core';
import Link from 'next/link';
import { Dots } from '~/app/components/Dots';
import classes from '~/styles/Hero.module.css';

export function HeroText() {
  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
        <Title className={classes.title}>
            FCIT Groups
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" c="dimmed" className={classes.description}>
          Join WhatsApp groups for your FCIT courses and never miss out an important updates.
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button className={classes.control} size="lg">
            <Link href="/addAGroup">
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}