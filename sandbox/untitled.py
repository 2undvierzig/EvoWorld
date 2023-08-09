import gym

env = gym.make('CartPole-v1')
observation = env.reset()
for _ in range(1000):
    env.render()
    action = env.action_space.sample()  # Taking a random action from the action space
    observation, reward, done, *info = env.step(action)
    if done:
        observation = env.reset()
env.close()