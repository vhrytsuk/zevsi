<?php
namespace Magento\Store\Model\StoreSwitcher\HashGenerator;

/**
 * Interceptor class for @see \Magento\Store\Model\StoreSwitcher\HashGenerator
 */
class Interceptor extends \Magento\Store\Model\StoreSwitcher\HashGenerator implements \Magento\Framework\Interception\InterceptorInterface
{
    use \Magento\Framework\Interception\Interceptor;

    public function __construct(\Magento\Framework\App\DeploymentConfig $deploymentConfig, \Magento\Framework\Url\Helper\Data $urlHelper, \Magento\Authorization\Model\UserContextInterface $currentUser)
    {
        $this->___init();
        parent::__construct($deploymentConfig, $urlHelper, $currentUser);
    }

    /**
     * {@inheritdoc}
     */
    public function switch(\Magento\Store\Api\Data\StoreInterface $fromStore, \Magento\Store\Api\Data\StoreInterface $targetStore, string $redirectUrl) : string
    {
        $pluginInfo = $this->pluginList->getNext($this->subjectType, 'switch');
        if (!$pluginInfo) {
            return parent::switch($fromStore, $targetStore, $redirectUrl);
        } else {
            return $this->___callPlugins('switch', func_get_args(), $pluginInfo);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function validateHash(string $signature, \Magento\Store\Model\StoreSwitcher\HashGenerator\HashData $hashData) : bool
    {
        $pluginInfo = $this->pluginList->getNext($this->subjectType, 'validateHash');
        if (!$pluginInfo) {
            return parent::validateHash($signature, $hashData);
        } else {
            return $this->___callPlugins('validateHash', func_get_args(), $pluginInfo);
        }
    }
}
