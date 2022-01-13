import { Divider, Drawer, List, ListItem, Typography } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import React, { Component } from 'react';

import { Meeting } from '../types/api';
import MeetingDateTime from './MeetingDateTime';

interface MeetingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MeetingsDrawerState {
  upcomingMeetings: Meeting[];
  pastMeetings: Meeting[];
}

class MeetingsDrawer extends Component<
  MeetingsDrawerProps,
  MeetingsDrawerState
> {
  constructor(props: MeetingsDrawerProps) {
    super(props);
    this.state = {
      upcomingMeetings: [],
      pastMeetings: [],
    };
  }

  componentDidMount() {
    this.fetchMeetingsInfoList();
  }

  fetchMeetingsInfoList = async () => {
    const fetchMeetings = await fetch(
      `${process.env.REACT_APP_API_ORIGIN}/meetings`,
      { credentials: 'include' }
    );
    if (fetchMeetings.ok) {
      const { data: allMeetings } = await fetchMeetings.json();
      let startIndexOfPastMeeting = allMeetings.length;
      for (let i = 0; i < allMeetings.length; i++) {
        if (Date.parse(allMeetings[i].starts_at) < Date.now()) {
          startIndexOfPastMeeting = i;
          break;
        }
      }
      this.setState({
        upcomingMeetings: allMeetings
          .slice(0, startIndexOfPastMeeting)
          .reverse(),
        pastMeetings: allMeetings.slice(startIndexOfPastMeeting),
      });
    }
  };

  render() {
    return (
      <Drawer
        variant="persistent"
        anchor="right"
        open={this.props.isOpen}
        transitionDuration={400}
        PaperProps={{
          sx: {
            '@media (max-width: 360px)': { width: '100vw' },
            width: '360px',
          },
        }}
      >
        <List sx={{ pt: 0 }}>
          <ListItem
            sx={{
              backgroundColor: 'primary.main',
              color: 'common.white',
              p: 1,
              '&:hover': {
                cursor: 'pointer',
              },
            }}
            onClick={() => this.props.onClose()}
          >
            <ArrowRightIcon />
          </ListItem>
          <Divider />
          <ListItem
            sx={{
              backgroundColor: 'primary.main',
              py: 2,
            }}
          >
            <Typography variant="h5" sx={{ color: 'common.white' }}>
              Upcoming meetings
            </Typography>
          </ListItem>
          {this.state.upcomingMeetings.map(meeting => (
            <MeetingDateTime key={meeting.id} meeting={meeting} />
          ))}
          {this.state.upcomingMeetings.length === 0 && <Divider />}
          <ListItem
            sx={{
              backgroundColor: 'primary.main',
              py: 2,
            }}
          >
            <Typography variant="h5" sx={{ color: 'common.white' }}>
              Past meetings
            </Typography>
          </ListItem>
          {this.state.pastMeetings.map(meeting => (
            <MeetingDateTime key={meeting.id} meeting={meeting} />
          ))}
        </List>
      </Drawer>
    );
  }
}

export default MeetingsDrawer;