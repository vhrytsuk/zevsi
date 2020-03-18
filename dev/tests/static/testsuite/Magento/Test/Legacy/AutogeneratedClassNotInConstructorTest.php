<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\Test\Legacy;

use Magento\Framework\App\Utility\Files;
use Magento\TestFramework\Utility\ClassNameExtractor;
use Magento\TestFramework\Utility\AutogeneratedClassNotInConstructorFinder;
use Magento\TestFramework\Utility\ChangedFiles;

class AutogeneratedClassNotInConstructorTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var string[]
     */
    private $autogeneratedClassesWhitelist;

    /**
     * @var ClassNameExtractor
     */
    private $classNameExtractor;

    /**
     * @var AutogeneratedClassNotInConstructorFinder
     */
    private $autogeneratedClassNotInConstructorFinder;

    /**
     * @var Files
     */
    private $fileUtilities;

    protected function setUp()
    {
        $this->classNameExtractor = new ClassNameExtractor();
        $this->autogeneratedClassNotInConstructorFinder = new AutogeneratedClassNotInConstructorFinder(
            $this->classNameExtractor
        );
        $this->fileUtilities = Files::init();
    }

    public function testAutogeneratedClassesRequestedInConstructor()
    {
        $fileTypes = Files::INCLUDE_APP_CODE | Files::INCLUDE_LIBS | Files::INCLUDE_SETUP | Files::AS_DATA_SET;
        $changedFiles = ChangedFiles::getPhpFiles(__DIR__ . '/_files/changed_files*', $fileTypes);
        $phpFiles = $this->fileUtilities->getPhpFiles($fileTypes);

        $existingClasses = [];
        $classesCreatedByObjectManager = [];
        foreach ($phpFiles as $file) {
            $filePath = $file[0];
            $fileContent = file_get_contents($filePath);
            $className = $this->classNameExtractor->getNameWithNamespace($fileContent);
            if ($className) {
                $existingClasses = array_merge(
                    $existingClasses,
                    [$filePath => $className]
                );
            }
        }
        foreach ($changedFiles as $file) {
            $filePath = $file[0];
            $fileContent = file_get_contents($filePath);
            $className = $this->classNameExtractor->getNameWithNamespace($fileContent);
            if ($className) {
                $tmpClassesCreatedByObjectManager = array_diff(
                    $this->autogeneratedClassNotInConstructorFinder->find($fileContent),
                    $this->getWhitelistedClasses()
                );

                if (!empty($tmpClassesCreatedByObjectManager)) {
                    $classesCreatedByObjectManager = array_merge(
                        $classesCreatedByObjectManager,
                        [$filePath => $tmpClassesCreatedByObjectManager]
                    );
                }
            }
        }

        $existingClasses = array_unique($existingClasses);

        $generatedDependenciesNotInConstructor = [];
        foreach ($classesCreatedByObjectManager as $key => $classes) {
            $autogeneratedClasses = array_diff($classes, $existingClasses);
            if (!empty($autogeneratedClasses)) {
                $generatedDependenciesNotInConstructor[$key] = $autogeneratedClasses;
            }
        }

        $this->assertEmpty(
            $generatedDependenciesNotInConstructor,
            "The following autogenerated classes need to be requested in constructor, otherwise compiler "
            . "will not be able to find and generate these classes \r\n"
            . print_r($generatedDependenciesNotInConstructor, true)
        );
    }

    /**
     * Get whitelisted classes
     *
     * @return string[]
     */
    private function getWhitelistedClasses()
    {
        if (!$this->autogeneratedClassesWhitelist) {
            $this->autogeneratedClassesWhitelist = require_once __DIR__
                . '/_files/autogenerated_class_not_in_constructor_whitelist.php';
        }
        return $this->autogeneratedClassesWhitelist;
    }
}
