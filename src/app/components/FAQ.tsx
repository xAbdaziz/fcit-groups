'use client'
import { Container, Title, Accordion } from '@mantine/core';
import classes from '~/styles/FAQ.module.css';

export function Faq() {
  return (
    <Container size="sm" className={classes.wrapper}>
      <Title ta="center" className={classes.title}>
        Frequently Asked Questions
      </Title>

      <Accordion variant="separated">
        <Accordion.Item className={classes.item} value="reset-password">
          <Accordion.Control>Why is a university email required?</Accordion.Control>
          <Accordion.Panel>We require a university email to mitigate spam and prevent unauthorized access to groups.</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="another-account">
          <Accordion.Control>Why is gender information necessary?</Accordion.Control>
          <Accordion.Panel>Gender information helps in categorizing groups. When you post a group, it will be marked as specific to the gender you've chosen.</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="newsletter">
          <Accordion.Control>Can groups be viewed by individuals of the other gender?</Accordion.Control>
          <Accordion.Panel>No, groups are gender-specific. This is another reason why we collect gender information.</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="credit-card">
          <Accordion.Control>How can I delete a group that I've posted?</Accordion.Control>
          <Accordion.Panel>Please reach out to our support team on Telegram: @xAbdaziz for assistance with group deletion.</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="payment">
          <Accordion.Control>What data is stored by the platform?</Accordion.Control>
          <Accordion.Panel>We store only the data you provide (Email, gender, and groups). We assure you that we do not share your data with third parties.</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}