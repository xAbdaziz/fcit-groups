// page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Select, Button, Text, Flex, rem, Table, Container } from '@mantine/core';
import { useForm } from '@mantine/form';
import LoginModal from '../components/LoginModal';
import { useDisclosure } from '@mantine/hooks';
import { useSession } from 'next-auth/react';
import { notifications } from '@mantine/notifications';

interface Courses {
  map(arg0: (course: { course_number: number; }) => number): number[];
  course_id: number;
  course_name: string;
  course_code: string;
  course_number: number;
}

interface WhatsAppGroups {
  map(arg0: (row: WhatsAppGroups) => React.JSX.Element): React.SetStateAction<never[]>;
  group_id: string,
  section: string,
  group_link: string,
  course_id: number,
  gender: number
}

function FindAGroup() {
  const [courseNumbers, setCourseNumbers] = useState<number[]>([]);
  const [rows, setRows] = useState([]);
  const [isModalOpen, { toggle: toggleModal, close: closeModal }] = useDisclosure(false);

  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      toggleModal();
    }
  }, [session]);

  const form = useForm({
    initialValues: {
      courseCode: '',
      courseNumber: ''
    },
    validate: {
      courseCode: (value) =>
        /^(CPIS|CPCS|CPIT|STAT|MATH|BUS|MRKT|ACCT)$/.test(value)
          ? null
          : "You didn't choose course code.",
      courseNumber: (value) =>
        /^(?!$)/.test(value)
          ? null
          : "You didn't choose course number."
    },
  });

  const handleSearch = async (values: { courseCode: string; courseNumber: string }) => {
    setRows([]);
    const response = await fetch('/api/searchGroup', {
      headers: {
        'courseCode': values.courseCode,
        'courseNumber': values.courseNumber.toString()
      }
    });

    if (response.status !== 200) {
      notifications.show({title:'Error', message: 'No group was found, maybe you should create one and add it with \"Add a Group\" button in the menu?', color: 'red'});
      return;
    }

    const data: WhatsAppGroups = await response.json() as WhatsAppGroups;
    setRows(data.map((row: WhatsAppGroups) => (
      <Table.Tr key={row.section}>
        <Table.Td>{row.section}</Table.Td>
        <Table.Td>
          {row.gender === 0 ? 'General' : row.gender === 1 ? 'Male' : 'Female'}
        </Table.Td>
        <Table.Td>
          <a target="_blank" href={row.group_link} rel="noopener noreferrer" style={{ color: 'deepskyblue' }}>
            Join
          </a>
        </Table.Td>
      </Table.Tr>
    )));
  };

  const fetchCourseNumbers = async (courseCode: string) => {
    const response = await fetch('/api/listOfCourses', {
      headers: {
        'courseCode': courseCode
      }
    });
    const data: Courses = await response.json() as Courses;
    const courseNumbers: number[] = data.map((course: { course_number: number; }) => course.course_number);
    setCourseNumbers(courseNumbers);
  };

  return (
    <>
      {/* Login Modal */}
      <LoginModal opened={isModalOpen} onClose={closeModal} disableClose />
      <form onSubmit={form.onSubmit(handleSearch as (values: { courseCode: string; courseNumber: string }) => void)}>
        <Flex justify="center" align="center" direction="column" mt="md">
          <Text size="h1" style={{ fontSize: rem(50), fontWeight: "bold" }} variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }}>Find a Group</Text>
          <Text size='md' fw={500} style={{ marginBottom: rem(20) }}>Enter course details:</Text>
          <Select style={{ marginBottom: rem(20) }} withAsterisk label="Course Code:" data={['CPIS', 'CPCS', 'CPIT', 'STAT', 'MATH', 'BUS', 'MRKT', 'ACCT']} {...form.getInputProps('courseCode')} onChange={(value) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            form.getInputProps('courseCode').onChange(value);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            value && fetchCourseNumbers(value);
          }}
          />
          <Select style={{ marginBottom: rem(20) }} withAsterisk label="Course Number:" data={courseNumbers.map(String)} {...form.getInputProps('courseNumber')} searchable />
          <Button style={{ marginBottom: rem(50) }} type="submit">Submit</Button>
        </Flex>
        {/* Tables */}
        <Container size="xs">
          <Table stickyHeader stickyHeaderOffset={60} striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Section</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Link</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Container>
      </form>
    </>
  );
}

export default FindAGroup;