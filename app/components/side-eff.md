    useEffect(() => {
    	const setupSocket = async () => {
    		try {
    			const socket = await connectSocket();

    			if (!socket || !session) {
    				console.error('❌ Socket connection failed');
    				return;
    			}

    			socket.emit('register', session.user.id);
    			const handleActiveUsers = (users: any[]) => {
    				setActiveUsers(users); // You'll need to define setActiveUsers in state
    			};

    			socket.emit('getActiveUsers');

    			socket.on('activeUsers', handleActiveUsers);
    			socket.on('activeUsersUpdated', handleActiveUsers);

    			const handleReceiveMessage = (message: any) => {
    				if (
    					type === 'group'
    						? message?.receiver !== params.id
    						: message?.sender._id !== params.id
    				) {
    					return;
    				}
    				return setMessages((prev) => [...prev, message]);
    			};
    			const handleVisibilityUpdate = (message: any) => {
    				const isAdmin = session.user.role === 'admin';
    				if (message) {
    					if (!isAdmin) {
    						setShouldScroll(false);
    						refetch();

    						if (message.visibility === 'private') {
    							setMessages((prev) => {
    								return prev.filter((msg) => msg._id !== message.messageId);
    							});
    						}
    					}
    					setMessages((prev) =>
    						prev.map((msg) =>
    							msg._id === message._id
    								? { ...msg, visibility: message.visibility }
    								: msg
    						)
    					);
    				}
    			};

    			socket.on('visibilityUpdated', handleVisibilityUpdate);
    			socket.on('receiveMessage', handleReceiveMessage);

    			// Move this cleanup into the outer scope so useEffect can return it
    			return () => {
    				socket.off('activeUsers');
    				socket.off('activeUsersUpdated');
    				socket.off('receiveMessage');
    				socket.off('visibilityUpdated');
    				socket.disconnect();
    			};
    		} catch (err) {
    			console.error('Socket setup failed:', err);
    		}
    	};

    	let cleanupFn: () => void;

    	if (session?.user?.id) {
    		setupSocket().then((cleanup) => {
    			cleanupFn = cleanup!;
    		});
    	}

    	return () => {
    		if (cleanupFn) cleanupFn();
    	};
    }, [session?.user?.id]);
