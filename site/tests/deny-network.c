#define _GNU_SOURCE
#include <errno.h>
#include <fcntl.h>
#include <stdlib.h>
#include <sys/socket.h>
#include <unistd.h>

static void record_attempt(void) {
  const char *path = getenv("NETWORK_DENY_LOG");
  if (!path) return;
  int fd = open(path, O_WRONLY | O_CREAT | O_APPEND, 0600);
  if (fd >= 0) { write(fd, "network syscall blocked\n", 24); close(fd); }
}

int socket(int domain, int type, int protocol) {
  (void)domain; (void)type; (void)protocol; record_attempt(); errno = EPERM; return -1;
}

int connect(int socket_fd, const struct sockaddr *address, socklen_t length) {
  (void)socket_fd; (void)address; (void)length; record_attempt(); errno = EPERM; return -1;
}
